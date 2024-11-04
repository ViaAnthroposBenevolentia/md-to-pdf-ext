// script.js

// Get DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileElem');
const convertBtn = document.getElementById('convert-btn');
// const preview = document.getElementById('preview'); // For optional preview

let markdownContent = '';

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop area when file is dragged over
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.add('hover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => dropArea.classList.remove('hover'), false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);
dropArea.addEventListener('click', () => fileInput.click(), false);
fileInput.addEventListener('change', handleFiles, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles({ target: { files } });
}

function handleFiles(e) {
  const files = e.target.files;
  if (files.length > 0 && files[0].type === 'text/markdown') {
    const reader = new FileReader();
    reader.onload = function(event) {
      markdownContent = event.target.result;
      convertBtn.disabled = false;
      // Optional Preview
      // const htmlContent = marked(markdownContent);
      // preview.innerHTML = htmlContent;
    };
    reader.readAsText(files[0]);
  } else {
    alert('Please select a valid Markdown (.md) file.');
  }
}

// Handle Convert Button Click
convertBtn.addEventListener('click', () => {
  const htmlContent = marked(markdownContent);
  const doc = new jsPDF();

  // Add content to PDF
  doc.fromHTML(htmlContent, 15, 15, {
    'width': 170
  });

  // Save the PDF
  doc.save('converted.pdf');
});
