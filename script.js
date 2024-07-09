function generateIdCards() {
    const file = document.getElementById('excelFile').files[0];
    if (!file) {
        alert('Please select an Excel file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';

        jsonData.forEach((row, index) => {
            const card = document.createElement('div');
            card.className = 'col-md-8 mb-4';
            card.innerHTML = `
            
              <div class="card border-black border-3 ">
              <div class="border ">
            <img class="head_img" src="./top_background_img.jpg" alt="">
          </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4 text-center">
                      <p class="text-start">अनु क्र : <span class="sr_no">${row['sr.no.']}</span></p>
                      <div class="border border-black p-2">
                        <img id="img-${index}" src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" alt="Avatar" class="img-fluid "/>
                        <input type="file" accept="image/*" onchange="loadImage(event, ${index})" class="form-control mt-2">
                      </div>
                    </div>
                    <div class="col-md-8">
                      <p>नाव : <span class="name">${row['name']}</span></p>
                      <p>पोलीस स्टेशन : <span class="Police_station">${row['police station']}</span></p>
                      <p>मो. नंबर: <span class="mob_no">${row['mobile number']}</span></p>
                      <p>मतदान केंद्र : <span class="voting_booth">${row['voting booth']}</span></p>
                      <p>बंदोबस्ताचे ठिकाण : <span class="place">${row['place']}</span></p>
                      <p>उपविभागीय पोलीस अधीकारी : <span class="officer_name">${row['officer name']}</span></p>
                      <p><strong>मेहकर : <span class="mehkar">${row['mehkar']}</span></strong></p>
                      <p>बंदोबस्त प्रभारी आधिकारी : <span class="in_charge">${row['in charge']}</span></p>
                    </div>
                  </div>
                </div>
              </div>`;
            container.appendChild(card);
        });
    };
    reader.readAsArrayBuffer(file);
}

function loadImage(event, index) {
    const img = document.getElementById(`img-${index}`);
    img.src = URL.createObjectURL(event.target.files[0]);
}

function printCards() {
    const cards = document.querySelectorAll('.card');
    const zip = new JSZip();
    const promises = [];

    // Hide input fields
    const inputFields = document.querySelectorAll('.card input[type="file"]');
    inputFields.forEach(input => input.classList.add('hidden'));

    cards.forEach((card, index) => {
        promises.push(new Promise((resolve) => {
            html2canvas(card).then(canvas => {
                canvas.toBlob(blob => {
                    zip.file(`id_card_${index + 1}.png`, blob);
                    resolve();
                });
            });
        }));
    });

    Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, 'id_cards.zip');
            // Show input fields again after generating the zip
            inputFields.forEach(input => input.classList.remove('hidden'));
        });
    });
}
