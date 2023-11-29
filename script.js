document.addEventListener('DOMContentLoaded', function () {
  const firebaseConfig = {
    apiKey: "AIzaSyB34sJGacPFqe-AXdWrmOthCr7vWChwCq8",
    authDomain: "file-sharing-website-3072b.firebaseapp.com",
    projectId: "file-sharing-website-3072b",
    storageBucket: "file-sharing-website-3072b.appspot.com",
    messagingSenderId: "860732379401",
    appId: "1:860732379401:web:12b5941975cc7bb33943d8",
    databaseURL: "https://file-sharing-website-3072b-default-rtdb.asia-southeast1.firebasedatabase.app",
  };

  firebase.initializeApp(firebaseConfig);

  const database = firebase.database();
  const storage = firebase.storage();

  window.uploadImage = function () {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
  
    if (!file) {
      alert('Please select a file before uploading.');
      return;
    }
  
    const uniqueId = Math.floor(10000 + Math.random() * 90000);
  
    const storageRef = storage.ref(`files/${uniqueId}`);
  
    const uploadButton = document.getElementById('upload');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
  
    uploadButton.disabled = true;
  
    const uploadTask = storageRef.put(file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBar.value = progress;
        progressText.textContent = `${progress.toFixed(2)}%`;
  
        uploadButton.innerText = `Uploading... ${progress.toFixed(2)}%`;
      },
      (error) => {
        console.error('Error uploading file:', error);
        uploadButton.disabled = false;
        uploadButton.innerText = 'Upload';
      },
      () => {
        storageRef.getDownloadURL().then(downloadURL => {
          database.ref(`files/${uniqueId}`).set({
            fileId: uniqueId,
            fileName: file.name, 
            fileURL: downloadURL
          });
  
          const showUniqueIdInput = document.getElementById('showunique');
          showUniqueIdInput.value = uniqueId;
          const showUniqueIDDiv = document.getElementById('ShowUniqueID');
          showUniqueIDDiv.removeAttribute('hidden');
  
          const receiveFileDiv = document.getElementById('downloadiv');
          receiveFileDiv.style.display = 'none';
  
          uploadButton.innerText = 'Home';
          uploadButton.onclick = function () {
            location.reload();
          };
  
          uploadButton.disabled = false;
        });
      }
    );
  };
  
  window.showimage = function () {
    const uniqueIdInput = document.getElementById('unique');
    const uniqueId = uniqueIdInput.value;

    database.ref(`files/${uniqueId}`).once('value').then(snapshot => {
      const fileDetails = snapshot.val();

      if (fileDetails) {
        const downloadLink = document.createElement('a');
        downloadLink.href = fileDetails.fileURL;
        downloadLink.download = fileDetails.fileName;
        downloadLink.style.display = 'none'; 
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        console.log('File not found.');
      }
    });
  };
});
