document.addEventListener('DOMContentLoaded', async function() {
    const handle = localStorage.getItem('userHandle');
    if (handle) {
        try {
            const response = await fetch(`/user/${handle}`);
            const data = await response.json();
            if (data.status === 'OK' && data.result.length > 0) {
                const user = data.result[0];

                document.getElementById('fullname').textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'নাম পাওয়া যায় নি';
                




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



document.getElementById('tagsInput').addEventListener('input', function() {
    this.value = this.value.toLowerCase();
   });
   let currentPage = 1;
   const limit = 500;

function fetchProblems(tags, page) {
   fetch(`/api/problems/${encodeURIComponent(tags)}?page=${page}&limit=${limit}`)
       .then(response => response.json())
       .then(data => {
           const resultsContainer = document.getElementById('results');
           const paginationContainer = document.getElementById('pagination');

           resultsContainer.innerHTML = ''; 
           paginationContainer.innerHTML = ''; 

           if (data.problems.length === 0) {
               resultsContainer.innerHTML = '<p>No problems found.</p>';
           } else {
               data.problems.forEach(problem => {
                   const card = document.createElement('div');
                   card.className = 'card mb-3';
                   card.innerHTML = `
                       <div class="card-body">
                           <h5 class="card-title text-primary">${problem.name}</h5>
                           <h6 class="card-subtitle mb-2 text-muted mb-0">Contest ID: ${problem.contestId}</h6>
                           <p class="card-text mb-0 text-success">Index: ${problem.index}</p>
                           
                           <p class="card-text mb-0 text-danger">Tags: ${problem.tags.join(', ')}</p>
                       </div>
                   `;
                   resultsContainer.appendChild(card);
               });

               // Pagination controls
               const totalPages = Math.ceil(data.total / limit);
               if (totalPages > 1) {
                // Previous button
                const prevLi = document.createElement('li');
                prevLi.className = `page-item ${page === 1 ? 'disabled' : ''}`;
                prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
                prevLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentPage > 1) fetchProblems(tags, currentPage - 1);
                });
                paginationContainer.appendChild(prevLi);

                // Page numbers
                for (let i = 1; i <= totalPages; i++) {
                    const li = document.createElement('li');
                    li.className = `page-item ${i === page ? 'active' : ''}`;
                    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
                    li.addEventListener('click', (e) => {
                        e.preventDefault();
                        fetchProblems(tags, i);
                        currentPage = i;
                    });
                    paginationContainer.appendChild(li);
                }

                // Next button
                const nextLi = document.createElement('li');
                nextLi.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
                nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
                nextLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) fetchProblems(tags, currentPage + 1);
                });
                paginationContainer.appendChild(nextLi);
            }
        }
       })
       .catch(error => {
           console.error('Error fetching data:', error);
           document.getElementById('results').innerHTML = '<p>Error fetching data. Please try again later.</p>';
       });
}

document.getElementById('searchButton').addEventListener('click', () => {
   const tags = document.getElementById('tagsInput').value.trim();
   if (tags) {
       fetchProblems(tags, 1);
       currentPage = 1;
   }
});