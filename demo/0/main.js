document
  .getElementById('send')
  .addEventListener('click', (e) => {
    e.preventDefault();

    const token = "696487450:AAHkp3Dh2Akp0lXFrjevLicuSoFbV3I2XAc";
    const chat_id = "@podlodka_sw";
    const params = {
      method: 'POST',
    }

    const message = document
      .getElementById('msg')
      .value;


      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${message}`, params);
  });

