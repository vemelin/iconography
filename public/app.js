async function upload() {
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files[0]) return;

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  await fetch("/api/upload", { method: "POST", body: formData });
  loadFiles();
}

async function loadFiles() {
  const ul = document.getElementById("filesList");
  ul.innerHTML = "";

  const res = await fetch("/api/files");
  const files = await res.json();

  files.forEach(f => {
    const li = document.createElement("li");
    const safe = JSON.stringify(f);
    li.innerHTML = `
      ${f}
      <button onclick='download(${safe})'>Download</button>
      <button onclick='del(${safe})'>Delete</button>
    `;
    ul.appendChild(li);
  });
}

async function download(filename) {
  window.location = `/api/download?file=${encodeURIComponent(filename)}`;
}

async function del(filename) {
  await fetch("/api/delete?file=" + encodeURIComponent(filename), { method: "DELETE" });
  loadFiles();
}

loadFiles();