document.addEventListener('DOMContentLoaded', async function() {
    const handle = localStorage.getItem('userHandle');
    if (handle) {
        try {
            const response = await fetch(`/user/${handle}`);
            const data = await response.json();
            if (data.status === 'OK' && data.result.length > 0) {
                const user = data.result[0];
                document.getElementById('avatar').src = user.avatar;

                document.getElementById('fullname').textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'নাম পাওয়া যায় নি';
                document.getElementById('name').textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'নাম পাওয়া যায় নি';
                document.getElementById('handle').textContent = user.handle;
                document.getElementById('rank').textContent = user.rank;
                document.getElementById('mrank').textContent = user.maxRank
                document.getElementById('rating').textContent = user.rating;
                document.getElementById('maxRating').textContent = user.maxRating;
                document.getElementById('country').textContent = user.country;
                document.getElementById('city').textContent = user.city;
                document.getElementById('organization').textContent = user.organization;
                document.getElementById('email').textContent = user.email;
                document.getElementById('contribution').textContent = user.contribution;
                document.getElementById('friendCount').textContent = user.friendOfCount;
                const seconds = user.lastOnlineTimeSeconds;




            } else {
                console.error('No user data found');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    } else {
        console.log('No user handle found in local storage');
    }
});