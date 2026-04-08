const API_KEY = "7uLHHdvit0KavMYJnXO4jPcKbpIRCpoB5xX52H9O";

async function getAPOD() {
    try {
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch APOD");
        }

        const data = await response.json();
        displayAPOD(data);

    } catch (error) {
        console.error(error);
        document.querySelector("#apod-container").innerHTML =
            `<p class="error">Unable to load APOD right now.</p>`;
    }
}

function displayAPOD(data) {
    const container = document.querySelector("#apod-container");

    const media =
        data.media_type === "image"
            ? `<img src="${data.url}" alt="${data.title}" class="apod-image">`
            : `<iframe src="${data.url}" class="apod-video" allowfullscreen></iframe>`;

    container.innerHTML = `
        <div class="apod-card">
            <h2 class="heading">${data.title}</h2>
            <p class="apod-date">${data.date}</p>
            ${media}
            <p class="body-text">${data.explanation}</p>
        </div>
    `;
}

getAPOD();
