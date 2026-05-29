import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

export const configurePassport = (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email found'), false);

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                email,
                firstName: profile.name?.givenName || '',
                lastName: profile.name?.familyName || '',
                avatar: profile.photos?.[0]?.value || '',
                isEmailVerified: true,
                role: 'alumni',
                authProvider: 'google',
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, false);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};
