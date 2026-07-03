const axios = require('axios');

async function testDelete() {
    try {
        // 1. Login to get token
        const loginRes = await axios.post('http://localhost:8000/api/login', {
            email: 'admin@sekolah.sch.id',
            password: 'password'
        });
        const token = loginRes.data.data.token;
        console.log('Logged in. Token:', token.substring(0, 20) + '...');

        // 2. Get users
        const usersRes = await axios.get('http://localhost:8000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const users = usersRes.data.data.data; // paginated
        const targetUser = users.find(u => u.email !== 'admin@sekolah.sch.id');
        
        if (!targetUser) {
            console.log('No user to delete');
            return;
        }
        
        console.log('Trying to delete user:', targetUser.id, targetUser.email);
        
        // 3. Delete user
        const deleteRes = await axios.delete(`http://localhost:8000/api/users/${targetUser.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Delete response:', deleteRes.status, deleteRes.data);
    } catch (e) {
        console.error('ERROR:', e.response ? e.response.data : e.message);
    }
}

testDelete();
