fetch('data/samples.json')
    .then(response => response.json())
    .then(data => {
        const simpleSamplesContainer = document.getElementById('simple-samples');
        const textSamplesContainer = document.getElementById('text-samples');

        // Handle Groups (like MVC, StyleTTS 2, JETS, VITS)
        if (data.groups) {
            data.groups.forEach(group => {
                const groupRow = document.createElement('div');
                groupRow.classList.add('model-row');

                // Add each model in the group
                group.samples.forEach(sample => {
                    const modelElement = document.createElement('div');
                    modelElement.classList.add('model');
                    modelElement.innerHTML = `
                        <h3>${sample.model}</h3>
                        <audio controls>
                            <source src="${sample.file}" type="audio/wav">
                            Your browser does not support the audio element.
                        </audio>
                    `;
                    groupRow.appendChild(modelElement);
                });

                // Append to the simple samples container
                simpleSamplesContainer.appendChild(groupRow);
            });
        }

        // Handle Texts (including Speech Diversity)
        data.texts.forEach(section => {
            // Add section title
            const sectionTitle = document.createElement('h2');
            sectionTitle.classList.add('section-title');
            sectionTitle.textContent = section.title;
            textSamplesContainer.appendChild(sectionTitle);

            // Add section description if available
            if (section.description) {
                const sectionDesc = document.createElement('p');
                sectionDesc.classList.add('section-description');
                sectionDesc.innerHTML = section.description;
                textSamplesContainer.appendChild(sectionDesc);
            }

            // Handle Speech Diversity separately
            if (section.title === "8. Speech Diversity") {
                section.samples.forEach(model => {
                    const modelRow = document.createElement('div');
                    modelRow.classList.add('model-row');

                    // Add model name
                    const modelTitle = document.createElement('h3');
                    modelTitle.textContent = model.name;
                    modelRow.appendChild(modelTitle);

                    // Create a horizontal container for audio files
                    const audioContainer = document.createElement('div');
                    audioContainer.classList.add('audio-container');

                    // Add audio files
                    model.files.forEach((file, fileIndex) => {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('model');
                
                    const label = document.createElement('h3');
                    label.textContent = `Sample ${fileIndex + 1}`;
                    wrapper.appendChild(label);
                
                    const audioElement = document.createElement('audio');
                    audioElement.controls = true;
                    audioElement.preload = 'metadata';
                
                    const sourceElement = document.createElement('source');
                    sourceElement.src = file;
                    sourceElement.type = 'audio/wav';
                
                    audioElement.appendChild(sourceElement);
                    wrapper.appendChild(audioElement);
                    audioContainer.appendChild(wrapper);
                });

                    modelRow.appendChild(audioContainer);
                    textSamplesContainer.appendChild(modelRow);
                });
            } else {
                // Handle normal text samples
                section.samples.forEach(sample => {
                    const textElement = document.createElement('div');
                    textElement.classList.add('text-block');
                    textElement.innerHTML = `<p><strong>Text:</strong> ${sample.text}</p>`;

                    const modelGroup = document.createElement('div');
                    modelGroup.classList.add('model-group');

                    sample.models.forEach(model => {
                        const modelElement = document.createElement('div');
                        modelElement.classList.add('model');
                        modelElement.innerHTML = `
                            <h3>${model.name}</h3>
                            <audio controls>
                                <source src="${model.file}" type="audio/wav">
                                Your browser does not support the audio element.
                            </audio>
                        `;
                        modelGroup.appendChild(modelElement);
                    });

                    textElement.appendChild(modelGroup);
                    textSamplesContainer.appendChild(textElement);
                });
            }

            // Add a horizontal line after each section (except Speech Diversity)
            if (section.title !== "8. Speech Diversity") {
                const hrElement = document.createElement('hr');
                textSamplesContainer.appendChild(hrElement);
            }
        });
    })
    .catch(error => console.error('Error loading samples:', error));
