export function client(url, method = "GET") {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    const progressBar = document.getElementById("progressBar");

    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status == 200) {
        let data = JSON.parse(this.response);

        resolve(data);
      } else {
        reject("can't get data from async");
      }
    };
    // xhr.onprogress = (evt) => {
    //   if (evt.lengthComputable === true) {
    //     console.log(evt);
    //     progressBar.style.transition = `all linear ${evt.timeStamp}ms`;
    //     progressBar.style.width =
    //       Math.round(evt.loaded / evt.total) * 100 + "%";
    //   }
    // };

    xhr.open(method, url, true);
    xhr.send();
  });
}

client.post = function (url, method = "POST") {
  return client(url, method);
};

client.get = function (url, method = "GET") {
  return client(url, method);
};
