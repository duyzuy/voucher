export function client(url, method = "GET") {
  return new Promise((resolve, reject) => {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(this.response);

        resolve(data);
      }
    };
    xhttp.open(method, url, true);
    xhttp.send();
  });
}

client.post = function (url, method = "POST") {
  return client(url, method);
};

client.get = function (url, method = "GET") {
  return client(url, method);
};
