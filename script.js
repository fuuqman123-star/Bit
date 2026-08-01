document.getElementById('btnDeploy').addEventListener('click', async () => {
  const fileInput = document.getElementById('htmlFile');
  const projectNameInput = document.getElementById('projectName');
  const projectName = projectNameInput.value.trim();
  const statusDiv = document.getElementById('status');

  // Validasi 1: Cek apakah nama project sudah diisi
  if (!projectName) {
    statusDiv.innerHTML = '<span style="color:red;">❌ Harap beri nama untuk website/project Anda terlebih dahulu!</span>';
    projectNameInput.focus();
    return;
  }

  // Validasi 2: Cek apakah file HTML sudah dipilih
  if (fileInput.files.length === 0) {
    statusDiv.innerHTML = '<span style="color:red;">❌ Silakan pilih file HTML yang ingin di-deploy!</span>';
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function(event) {
    const htmlContent = event.target.result;
    
    statusDiv.innerHTML = 'Memproses deployment... ⏳';

    try {
      // Mengirim nama project dan isi file HTML ke backend lokal
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectName: projectName,
          htmlContent: htmlContent
        })
      });

      const result = await response.json();

      if (response.ok) {
        statusDiv.innerHTML = `
          <div style="color:green; margin-top: 10px;">
            ✅ <strong>Berhasil Dideploy!</strong><br>
            Nama Website: <em>${projectName}</em><br>
            URL: <a href="${result.url}" target="_blank" rel="noopener noreferrer">${result.url}</a>
          </div>
        `;
      } else {
        statusDiv.innerHTML = `<span style="color:red;">❌ Gagal: ${result.error}</span>`;
      }
    } catch (error) {
      statusDiv.innerHTML = `<span style="color:red;">❌ Terjadi kesalahan jaringan.</span>`;
    }
  };

  reader.readAsText(file);
});
