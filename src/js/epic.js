const API_KEY = "7uLHHdvit0KavMYJnXO4jPcKbpIRCpoB5xX52H9O";

async function getEPIC() {
    try {
        const response = await fetch(
            `https://api.nasa.gov/EPIC/api/natural?api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch EPIC data");
        }

        const data = await response.json();

        // Use the most recent image
        const latest = data[0];
        displayEPIC(latest);

    } catch (error) {
        console.error(error);
        document.querySelector("#epic-container").innerHTML =
            `<p class="error">Unable to load EPIC image right now.</p>`;
    }
}

function displayEPIC(item) {
    const container = document.querySelector("#epic-container");

    // Extract date parts
    const [year, month, day] = item.date.split(" ")[0].split("-");

    // Build the image URL
    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${item.image}.png`;

    container.innerHTML = `
        <div class="epic-card">
            <h2 class="heading">EPIC: Earth Polychromatic Imaging Camera</h2>
            <p class="epic-date">${item.date}</p>
            <img src="${imageUrl}" alt="EPIC Earth Image" class="epic-image">
            <p class="body-text epic-caption">${item.caption}</p>
        </div>
    `;
}

getEPIC();
