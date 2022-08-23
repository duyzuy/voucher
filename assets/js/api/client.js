import { isEmpty } from "../utils/helper.js";
export function client(url, method, data) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      if (this.status == 200) {
        let data = JSON.parse(this.response);

        resolve(data);
      } else {
        reject("can't get data from async");
      }
    };

    xhr.open(method, url, true);

    if (data === undefined || isEmpty(data)) {
      xhr.send();
    } else {
      if ("object" === typeof data) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
        xhr.send(formData);
      } else {
        throw new Error("data must be object type");
      }
    }
  });
}

client.post = function (url, { method = "POST", body = {} } = {}) {
  return client(url, method, body);
};

client.get = function (url, { method = "GET", body = {} } = {}) {
  return client(url, method, body);
};
