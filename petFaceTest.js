// More API functions here:                                                                                                                                                                                                                                                                              
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                                                        
// the link to your model provided by Teachable Machine export panel                                                                                                                                                                                                                                     
const URL = "https://teachablemachine.withgoogle.com/models/jeFuiXuMf/";                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                        
let model, labelContainer, maxPredictions;                                                                                                                                                                                                                                                              
let uploadedImageElement;
let predictButton;
let imageUploadInput;
                                                                                                                                                                                                                                                                                                        
// Load the image model                                                                                                                                                                                                                                                                                  
async function initModel() {
    const modelURL = URL + "model.json";                                                                                                                                                                                                                                                                 
    const metadataURL = URL + "metadata.json";                                                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                                                        
    model = await tmImage.load(modelURL, metadataURL);                                                                                                                                                                                                                                                   
    maxPredictions = model.getTotalClasses();                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                        
    labelContainer = document.getElementById("label-container");                                                                                                                                                                                                                                         
    // Initial creation of prediction divs, now also recreated on image change                                                                                                                                                                                                                             
    for (let i = 0; i < maxPredictions; i++) {                                                                                                                                                                                                                                                           
        labelContainer.appendChild(document.createElement("div"));                                                                                                                                                                                                                                       
    }
}                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                        
// run the uploaded image through the image model                                                                                                                                                                                                                                                          
async function predict() {                                                                                                                                                                                                                                                                               
    if (!model) {
        console.error("Model not loaded yet.");
        return;
    }
    if (!uploadedImageElement || uploadedImageElement.style.display === 'none') {
        console.error("No image uploaded or displayed for prediction.");
        return;
    }

    // Predict can take in an image, video or canvas html element                                                                                                                                                                                                                                        
    const prediction = await model.predict(uploadedImageElement);                                                                                                                                                                                                                                               
    for (let i = 0; i < maxPredictions; i++) {                                                                                                                                                                                                                                                           
        const classPrediction =                                                                                                                                                                                                                                                                          
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";                                                                                                                                                                                                                       
        // Ensure childNode exists before setting innerHTML (this is now handled by recreation logic)                                                                                                                                                                                                   
        if (labelContainer.childNodes[i]) {
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    uploadedImageElement = document.getElementById('uploaded-image');
    predictButton = document.getElementById('predict-button');
    imageUploadInput = document.getElementById('image-upload');

    initModel(); // Load the model as soon as the DOM is ready

    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImageElement.src = e.target.result;
                uploadedImageElement.style.display = 'block'; // Show the image
                predictButton.style.display = 'block'; // Show the predict button
                
                // Clear and recreate prediction divs when a new image is loaded
                if (labelContainer) {
                    while (labelContainer.firstChild) {
                        labelContainer.removeChild(labelContainer.lastChild);
                    }
                    for (let i = 0; i < maxPredictions; i++) {
                        labelContainer.appendChild(document.createElement("div"));
                    }
                }
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImageElement.style.display = 'none';
            predictButton.style.display = 'none';
            if (labelContainer) {
                while (labelContainer.firstChild) {
                    labelContainer.removeChild(labelContainer.lastChild);
                }
            }
        }
    });

    predictButton.addEventListener('click', predict);
});