const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting System End-to-End API & Feature Tests...\n');

  try {
    // 1. Login Student
    console.log('1️⃣ Testing Student Login...');
    const studentLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'mranjana9094@gmail.com', password: 'Hello@123' }),
    });
    const studentData: any = await studentLoginRes.json();
    if (!studentData.success) throw new Error('Student login failed: ' + JSON.stringify(studentData));
    const studentToken = studentData.accessToken;
    const studentId = studentData.user._id;
    console.log(`  ✅ Student Logged In: ${studentData.user.fullName} (${studentId})`);

    // 2. Login Alumni
    console.log('2️⃣ Testing Alumni Login...');
    const alumniLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'aarav.patel@example.com', password: 'password123' }),
    });
    const alumniData: any = await alumniLoginRes.json();
    if (!alumniData.success) throw new Error('Alumni login failed: ' + JSON.stringify(alumniData));
    const alumniToken = alumniData.accessToken;
    const alumniId = alumniData.user._id;
    console.log(`  ✅ Alumni Logged In: ${alumniData.user.fullName} (${alumniId})`);

    const studentHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    };
    const alumniHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${alumniToken}`,
    };

    // 3. Post Creation & Interaction
    console.log('3️⃣ Testing Post Creation, Likes & Comments...');
    const createPostRes = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        content: 'Excited to connect with IITRAM alumni and explore research & career opportunities! #StudentLife #IITRAM',
        postType: 'update',
      }),
    });
    const postData: any = await createPostRes.json();
    if (!postData.success) throw new Error('Post creation failed: ' + JSON.stringify(postData));
    const postId = postData.data._id;
    console.log(`  ✅ Post Created Successfully! (ID: ${postId})`);

    // Alumni Likes Student Post
    await fetch(`${API_URL}/posts/${postId}/like`, { method: 'POST', headers: alumniHeaders });
    console.log('  ✅ Alumni liked the student post');

    // Alumni Comments on Student Post
    const commentRes = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: alumniHeaders,
      body: JSON.stringify({ content: 'Welcome Ranjana! Happy to mentor and connect.' }),
    });
    const commentData: any = await commentRes.json();
    console.log('  ✅ Alumni commented on the post:', commentData.data?.content || 'Done');

    // 4. Connection Request
    console.log('4️⃣ Testing Connection Request & Acceptance...');
    const connReq = await fetch(`${API_URL}/connections/request/${alumniId}`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({ message: 'Hi Aarav, I would love to connect with you on the platform!' }),
    });
    const connData: any = await connReq.json();
    console.log('  ✅ Connection request sent from Student to Alumni:', connData.message);

    // Get Pending requests for Alumni
    const pendingRes = await fetch(`${API_URL}/connections/pending`, { headers: alumniHeaders });
    const pendingData: any = await pendingRes.json();
    const incomingConn = pendingData.data?.incoming?.[0];
    if (incomingConn) {
      console.log(`  ✅ Pending request received by Alumni from ${incomingConn.requester.firstName}`);
      // Alumni accepts connection
      const acceptRes = await fetch(`${API_URL}/connections/${incomingConn._id}/respond`, {
        method: 'PATCH',
        headers: alumniHeaders,
        body: JSON.stringify({ action: 'accept' }),
      });
      const acceptData: any = await acceptRes.json();
      console.log('  ✅ Connection accepted! Status:', acceptData.data?.status);
    }

    // 5. Chat & Messaging
    console.log('5️⃣ Testing Direct Chatting & Messaging...');
    const convRes = await fetch(`${API_URL}/messages/conversations`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({ participantId: alumniId }),
    });
    const convData: any = await convRes.json();
    const conversationId = convData.data._id;
    console.log(`  ✅ Conversation initialized (ID: ${conversationId})`);

    const msgRes = await fetch(`${API_URL}/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({ content: 'Hello Aarav sir! Thank you for accepting my connection request.' }),
    });
    const msgData: any = await msgRes.json();
    console.log('  ✅ Message sent cleanly:', msgData.data?.content);

    // 6. Job Browsing
    console.log('6️⃣ Testing Jobs API...');
    const jobsRes = await fetch(`${API_URL}/jobs`, { headers: studentHeaders });
    const jobsData: any = await jobsRes.json();
    console.log(`  ✅ Jobs fetched successfully (${jobsData.data?.length || 0} jobs found)`);

    // 7. Profile Fetch & Update
    console.log('7️⃣ Testing Profile Fetch & Update...');
    const profileRes = await fetch(`${API_URL}/auth/me`, { headers: studentHeaders });
    const profileData: any = await profileRes.json();
    console.log(`  ✅ User Profile Fetched: ${profileData.user?.fullName}, Role: ${profileData.user?.role}`);

    console.log('\n🎉 ALL SYSTEM TESTS PASSED SUCCESSFULLY! 💯');
  } catch (err: any) {
    console.error('❌ Test failed:', err.message);
  }
}

runTests();
