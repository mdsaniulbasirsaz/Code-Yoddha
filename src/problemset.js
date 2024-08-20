

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
document.addEventListener('DOMContentLoaded', function() {
    fetchProblems(1);
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => fetchProblems(1));
});

const limit = 25; 

function fetchProblems(page) {
    const searchQuery = document.getElementById('searchInput').value.trim().toUpperCase(); // Get the search input value and convert to uppercase

    fetch('https://codeforces.com/api/problemset.problems')
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            const paginationContainer = document.getElementById('pagination');
            const tableBody = resultsContainer.querySelector('tbody');

            tableBody.innerHTML = ''; 
            paginationContainer.innerHTML = ''; 

            let problems = data.result.problems;
            if (searchQuery) {
                problems = problems.filter(problem => problem.index.toUpperCase().includes(searchQuery));
            }
            if (problems.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No problems found.</td></tr>';
                return;
            }

            const offset = (page - 1) * limit;
            const currentProblems = problems.slice(offset, offset + limit);

            currentProblems.forEach((problem, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${offset + index + 1}</td>
                    <td class="text-primary">${problem.name}</td>
                    <td class="text-muted">${problem.contestId}</td>
                    <td class="text-success">${problem.index}</td>
                    <td class="text-danger">${problem.tags ? problem.tags.join(', ') : 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });

            const totalPages = Math.ceil(problems.length / limit);
             // Pagination controls

             // Previous button
             const prevLi = document.createElement('li');
             prevLi.className = `page-item ${page === 1 ? 'disabled' : ''}`;
             prevLi.innerHTML = `<button type="button" class="btn btn-sm btn-primary"><i class="fas fa-chevron-left"></i> </button>`;
             prevLi.addEventListener('click', (e) => {
                 e.preventDefault();
                 if (page > 1) {
                     currentPage = page - 1;
                     fetchProblems(currentPage);
                 }
             });
             paginationContainer.appendChild(prevLi);
 
             // Next button
             const nextLi = document.createElement('li');
             nextLi.className = `page-item ${page === totalPages ? 'disabled' : ''}`;
             nextLi.innerHTML = `<button type="button" class="btn btn-primary btn-sm mt-3"><i class="fas fa-chevron-right"></i></button>`;
             nextLi.addEventListener('click', (e) => {
                 e.preventDefault();
                 if (page < totalPages) {
                     currentPage = page + 1;
                     fetchProblems(currentPage);
                 }
             });
             paginationContainer.appendChild(nextLi);
            })

        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('results').innerHTML = '<tr><td colspan="5">Error fetching data. Please try again later.</td></tr>';
        });
}


