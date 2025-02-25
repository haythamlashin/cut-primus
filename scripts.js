// Password Protection
const PASSWORD = "your-secret-password"; // Replace with your desired password

document.getElementById('login-btn').addEventListener('click', () => {
    const userInput = document.getElementById('password-input').value;

    if (userInput === PASSWORD) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-site').classList.remove('hidden');
    } else {
        document.getElementById('error-msg').classList.remove('hidden');
    }
});

// BarBot Functionality
document.getElementById('barbot-btn').addEventListener('click', () => {
    document.getElementById('barbot-modal').classList.remove('hidden');
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('barbot-modal').classList.add('hidden');
});

const barbotResponses = {
    "hello": "Hi there! How can I assist you today?",
    "haircare tips": "For best results, wash your hair every 2-3 days and use a moisturizing conditioner.",
    "product recommendation": "Try L'Oréal Men Expert Hydrating Shampoo for soft, manageable hair."
};

document.getElementById('barbot-send').addEventListener('click', () => {
    const input = document.getElementById('barbot-input').value.toLowerCase();
    const response = barbotResponses[input] || "I'm not sure how to help with that.";
    document.getElementById('barbot-response').innerHTML = `<p>${response}</p>`;
});

// Face Analysis
document.getElementById('find-my-cut-btn').addEventListener('click', () => {
    document.querySelector('#face-analysis').classList.remove('hidden');
});

document.getElementById('start-camera-btn').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('camera-stream');
        video.srcObject = stream;
        document.getElementById('start-camera-btn').classList.add('hidden');
        document.getElementById('analyze-face-btn').classList.remove('hidden');
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
});

document.getElementById('analyze-face-btn').addEventListener('click', async () => {
    const video = document.getElementById('camera-stream');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = tf.browser.fromPixels(canvas).resizeNearestNeighbor([128, 128]).toFloat().expandDims();
    const predictions = await model.predict(img).data(); // Assuming 'model' is loaded

    const faceShape = ['Oval', 'Round', 'Square'][predictions.indexOf(Math.max(...predictions))];
    document.getElementById('face-shape').textContent = faceShape;

    // Simulate hair type and face length
    document.getElementById('hair-type').textContent = 'Wavy';
    document.getElementById('face-length').textContent = 'Medium';

    document.querySelector('#results-page').classList.remove('hidden');
});

// AR Try-On
document.querySelectorAll('.hairstyle').forEach(hairstyle => {
    hairstyle.addEventListener('click', () => {
        const selectedStyle = hairstyle.dataset.style;
        document.getElementById('virtual-hairstyle').setAttribute('gltf-model', `#hairstyle-${selectedStyle}`);
        document.querySelector('#ar-try-on').classList.remove('hidden');
    });
});

document.getElementById('try-on-btn').addEventListener('click', () => {
    document.querySelector('#ar-try-on').classList.remove('hidden');
});

// Styling Instructions
document.getElementById('hair-routine-btn').addEventListener('click', () => {
    const products = recommendProducts("Oval", "hair");
    document.getElementById('product-list').innerHTML = `
        <li>Hair: ${products.hair}</li>
    `;
    document.getElementById('routine-window').classList.remove('hidden');
});

document.getElementById('beard-routine-btn').addEventListener('click', () => {
    const products = recommendProducts("Oval", "beard");
    document.getElementById('product-list').innerHTML = `
        <li>Beard: ${products.beard}</li>
    `;
    document.getElementById('routine-window').classList.remove('hidden');
});

function recommendProducts(faceShape, category) {
    const products = {
        "Oval": { hair: "L'Oréal Men Expert Clay Wax", beard: "L'Oréal Men Expert Beard Oil" },
        "Round": { hair: "L'Oréal Men Expert Volumizing Mousse", beard: "L'Oréal Men Expert Precision Trimmer" },
        "Square": { hair: "L'Oréal Men Expert Hydrating Shampoo", beard: "L'Oréal Men Expert Moisturizing Balm" }
    };

    return products[faceShape][category];
}