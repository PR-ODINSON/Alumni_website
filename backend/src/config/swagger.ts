import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IITRAM Alumni Platform API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the IITRAM Alumni Relationship and Career Networking Platform. Built with Node.js, Express, TypeScript, and MongoDB.',
      contact: {
        name: 'IITRAM Developer Team',
        email: 'developer@iitram.ac.in',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['student', 'alumni', 'faculty', 'admin'] },
            avatar: { type: 'string' },
            coverImage: { type: 'string' },
            bio: { type: 'string' },
            phone: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                state: { type: 'string' },
                country: { type: 'string' },
              },
            },
            socialLinks: {
              type: 'object',
              properties: {
                linkedin: { type: 'string' },
                github: { type: 'string' },
                twitter: { type: 'string' },
                website: { type: 'string' },
              },
            },
            isEmailVerified: { type: 'boolean' },
            isOnboarded: { type: 'boolean' },
            isVerified: { type: 'boolean' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AlumniProfile: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', description: 'User ID reference' },
            degreeType: { type: 'string', enum: ['B.Tech', 'M.Tech', 'PhD'] },
            department: { type: 'string' },
            batch: { type: 'number' },
            employmentStatus: { type: 'string', enum: ['employed', 'unemployed', 'higher-studies', 'self-employed', 'entrepreneur'] },
            currentCompany: { type: 'string' },
            currentPosition: { type: 'string' },
            currentIndustry: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
            isMentor: { type: 'boolean' },
            mentorshipTopics: { type: 'array', items: { type: 'string' } },
            startup: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                sector: { type: 'string' },
                stage: { type: 'string' },
                website: { type: 'string' },
              },
            },
            verificationStatus: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
          },
        },
        StudentProfile: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string', description: 'User ID reference' },
            degreeType: { type: 'string' },
            department: { type: 'string' },
            batch: { type: 'number' },
            currentYear: { type: 'number' },
            currentSemester: { type: 'number' },
            skills: { type: 'array', items: { type: 'string' } },
            interests: { type: 'array', items: { type: 'string' } },
          },
        },
        Job: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            postedBy: { type: 'string', description: 'User ID reference' },
            title: { type: 'string' },
            company: { type: 'string' },
            companyLogo: { type: 'string' },
            location: { type: 'string' },
            locationType: { type: 'string', enum: ['onsite', 'remote', 'hybrid'] },
            jobType: { type: 'string', enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'] },
            industry: { type: 'string' },
            description: { type: 'string' },
            requirements: { type: 'array', items: { type: 'string' } },
            responsibilities: { type: 'array', items: { type: 'string' } },
            skills: { type: 'array', items: { type: 'string' } },
            experience: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
              },
            },
            salary: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' },
                currency: { type: 'string' },
                period: { type: 'string' },
                isHidden: { type: 'boolean' },
              },
            },
            isReferralAvailable: { type: 'boolean' },
            isActive: { type: 'boolean' },
            applicants: { type: 'array', items: { type: 'string' } },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            organizer: { type: 'string', description: 'User ID reference' },
            title: { type: 'string' },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            eventType: { type: 'string', enum: ['reunion', 'alumni-meet', 'workshop', 'webinar', 'guest-lecture', 'conference', 'other'] },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            isVirtual: { type: 'boolean' },
            virtualLink: { type: 'string' },
            venue: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            maxAttendees: { type: 'number' },
            isFree: { type: 'boolean' },
            fee: { type: 'number' },
            coverImage: { type: 'string' },
            speakers: { type: 'array', items: { type: 'string' } },
            tags: { type: 'array', items: { type: 'string' } },
            registeredCount: { type: 'number' },
          },
        },
        Mentorship: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            mentor: { type: 'string', description: 'User ID reference' },
            mentee: { type: 'string', description: 'User ID reference' },
            status: { type: 'string', enum: ['pending', 'active', 'completed', 'rejected', 'cancelled'] },
            goals: { type: 'string' },
            areas: { type: 'array', items: { type: 'string' } },
            sessions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  scheduledAt: { type: 'string', format: 'date-time' },
                  duration: { type: 'number' },
                  platform: { type: 'string' },
                  meetingLink: { type: 'string' },
                  status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'] },
                },
              },
            },
          },
        },
        ResearchProject: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            abstract: { type: 'string' },
            description: { type: 'string' },
            domain: { type: 'string' },
            subDomain: { type: 'string' },
            keywords: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['open', 'in-progress', 'completed', 'on-hold'] },
            type: { type: 'string', enum: ['thesis', 'paper', 'project', 'startup-research', 'collaboration'] },
            pi: { type: 'string', description: 'Principal Investigator User ID' },
            coInvestigators: { type: 'array', items: { type: 'string' } },
            isPublic: { type: 'boolean' },
            views: { type: 'number' },
          },
        },
        SuccessStory: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            alumni: { type: 'string', description: 'User ID reference' },
            title: { type: 'string' },
            subtitle: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string', enum: ['career', 'entrepreneurship', 'research', 'social-impact', 'arts', 'sports', 'leadership', 'other'] },
            coverImage: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            highlights: { type: 'array', items: { type: 'string' } },
            quote: { type: 'string' },
            timeline: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  year: { type: 'number' },
                  milestone: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
            isPublished: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
            views: { type: 'number' },
            likes: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['firstName', 'lastName', 'email', 'password'],
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    role: { type: 'string', enum: ['student', 'alumni', 'faculty'] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Registration successful' },
            400: { description: 'Validation errors or user already exists' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'Login user',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful. Returns access and refresh tokens.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      accessToken: { type: 'string' },
                      refreshToken: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          summary: 'Get current user session info',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User retrieval successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/users/search': {
        get: {
          summary: 'Search platform users',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Query string' },
            { name: 'role', in: 'query', schema: { type: 'string', enum: ['student', 'alumni', 'faculty', 'admin'] } },
          ],
          responses: {
            200: { description: 'Search results' },
          },
        },
      },
      '/api/alumni': {
        get: {
          summary: 'Get all alumni directory profiles',
          tags: ['Alumni'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'number' } },
            { name: 'limit', in: 'query', schema: { type: 'number' } },
            { name: 'batch', in: 'query', schema: { type: 'string' } },
            { name: 'department', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'List of alumni profiles' },
          },
        },
      },
      '/api/students': {
        get: {
          summary: 'Get all student directory profiles',
          tags: ['Students'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'number' } },
            { name: 'limit', in: 'query', schema: { type: 'number' } },
            { name: 'batch', in: 'query', schema: { type: 'string' } },
            { name: 'department', in: 'query', schema: { type: 'string' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'List of student profiles' },
          },
        },
      },
      '/api/posts': {
        get: {
          summary: 'Get community feed posts (Paginated)',
          tags: ['Posts & Feed'],
          parameters: [
            { name: 'cursor', in: 'query', schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'number' } },
            { name: 'postType', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Feed posts list' },
          },
        },
        post: {
          summary: 'Create a new feed post',
          tags: ['Posts & Feed'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['content'],
                  properties: {
                    content: { type: 'string' },
                    postType: { type: 'string', enum: ['general', 'announcement', 'achievement', 'job', 'event', 'article'] },
                    images: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Post created' },
          },
        },
      },
      '/api/jobs': {
        get: {
          summary: 'Browse job opportunities',
          tags: ['Jobs'],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'jobType', in: 'query', schema: { type: 'string' } },
            { name: 'locationType', in: 'query', schema: { type: 'string' } },
            { name: 'industry', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'List of jobs' },
          },
        },
        post: {
          summary: 'Post a new job opportunity',
          tags: ['Jobs'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Job' },
              },
            },
          },
          responses: {
            201: { description: 'Job posted successfully' },
          },
        },
      },
      '/api/events': {
        get: {
          summary: 'Get all platform events',
          tags: ['Events'],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'eventType', in: 'query', schema: { type: 'string' } },
            { name: 'upcoming', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
          ],
          responses: {
            200: { description: 'List of events' },
          },
        },
        post: {
          summary: 'Create a new event',
          tags: ['Events'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Event' },
              },
            },
          },
          responses: {
            201: { description: 'Event created successfully' },
          },
        },
      },
      '/api/mentorship/request': {
        post: {
          summary: 'Request a mentorship program connection',
          tags: ['Mentorship'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['mentorId', 'goals'],
                  properties: {
                    mentorId: { type: 'string' },
                    goals: { type: 'string' },
                    message: { type: 'string' },
                    areas: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Mentorship request submitted' },
          },
        },
      },
      '/api/research': {
        get: {
          summary: 'List research projects',
          tags: ['Research Hub'],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['open', 'in-progress', 'completed', 'on-hold'] } },
            { name: 'type', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'List of projects' },
          },
        },
        post: {
          summary: 'Post a research topic/project',
          tags: ['Research Hub'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ResearchProject' },
              },
            },
          },
          responses: {
            201: { description: 'Research project posted' },
          },
        },
      },
      '/api/success-stories': {
        get: {
          summary: 'Get published success stories',
          tags: ['Success Stories'],
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'featured', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'List of stories' },
          },
        },
        post: {
          summary: 'Create/Submit success story',
          tags: ['Success Stories'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessStory' },
              },
            },
          },
          responses: {
            201: { description: 'Story created' },
          },
        },
      },
      '/api/analytics/overview': {
        get: {
          summary: 'Get general platform statistics',
          tags: ['Analytics'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Overview statistics' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
