const btnMenu = document.getElementsByClassName("navbar-toggler");
const wrapper = document.getElementsByClassName("wrapper");

btnMenu[0].addEventListener("click", function (e) {
  wrapper[0].parentElement.classList.toggle("active__menu");
  this.classList.toggle("open");

  if (wrapper[0].parentElement.classList.contains("active__menu")) {
    this.innerHTML = '<i class="bi bi-x"></i>';
  } else {
    this.innerHTML = '<span class="navbar-toggler-icon"></span>';
  }
});

//tab passenger

const tabButtons = document.querySelectorAll("#passenger__items button");
const tabs = document.querySelectorAll("#passenger__tabs > .passgenser__tab");

tabButtons.forEach(function (tabButton) {
  tabButton.addEventListener("click", function () {
    const btnAttr = this.dataset.target;

    if (!this.classList.contains(".current")) {
      tabButtons.forEach(function (tabButton) {
        tabButton.classList.remove("current");
      });

      this.classList.add("current");
    } else {
    }

    tabs.forEach(function (tab) {
      if (tab.classList.contains("active")) {
        tab.classList.remove("active");
      }
    });
    document
      .querySelectorAll(`#passenger__tabs ${btnAttr}`)[0]
      .classList.add("active");
  });
});
var homeSlider = document.getElementById("home__slider");
if (homeSlider) {
  $(homeSlider).slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3,
    //       infinite: true,
    //       dots: true
    //     }
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2
    //     }
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1
    //     }
    //   }
    // ]
  });
}

/**quantity voucher */

const quantityMinus = document.getElementsByClassName("quantity__minus");
const quantityPlus = document.getElementsByClassName("quantity__plus");

for (var i = 0; i < quantityMinus.length; i++) {
  quantityMinus[i].addEventListener("click", function () {
    const parent = this.parentNode;
    const input = parent.querySelector("input");
    const oldValue = parseFloat(input.value);
    const min = parseFloat(input.min);

    if (oldValue == min) {
      return;
    }
    const newValue = oldValue - 1;
    input.value = newValue;
  });
}

for (var i = 0; i < quantityPlus.length; i++) {
  quantityPlus[i].addEventListener("click", function () {
    const parent = this.parentNode;
    const input = parent.querySelector("input");
    const oldValue = parseFloat(input.value);
    const max = parseFloat(input.max);

    if (oldValue == max) {
      return;
    }
    const newValue = oldValue + 1;
    input.value = newValue;
  });
}

//gift voucher reciept

const checkGiftVoucher = document.getElementById("giftVoucher");
const beneciaryContainer = document.getElementById("beneciaryContainer");
if (checkGiftVoucher) {
  if (!checkGiftVoucher.checked) {
    beneciaryContainer.classList.add("hide");
  }
  checkGiftVoucher.addEventListener("change", function () {
    if (giftVoucher.checked) {
      beneciaryContainer.classList.add("show");
      beneciaryContainer.classList.remove("hide");
    } else {
      beneciaryContainer.classList.remove("show");
      beneciaryContainer.classList.add("hide");
    }
  });
}
const paxModal = document.getElementById("paxModal");
const btnSavePax = document.getElementById("btnSavePax");
const paxInformationInput = document.getElementById("paxInformationInput");
const benefiCiaries = document.getElementById("beneficiaries");
if (paxModal) {
  paxModal.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget;

    var html = null;
    var paxFamilyName = paxInformationInput.querySelector(
      'input[name="paxFamilyName"]'
    );
    var paxMiddleName = paxInformationInput.querySelector(
      'input[name="paxMiddleName"]'
    );
    var paxEmail = paxInformationInput.querySelector('input[name="paxEmail"]');
    var paxPhoneNumber = paxInformationInput.querySelector(
      'input[name="paxPhoneNumber"]'
    );
    var templateTypes = paxInformationInput.querySelectorAll(
      'input[name="templateType"]'
    );
    var paxMessage = paxInformationInput.querySelector(
      'textarea[name="paxMessage"]'
    );
    var templateType = null;
    var benefiCiariesItems =
      benefiCiaries.querySelectorAll(".beneficiary__item");

    paxFamilyName.value = null;
    paxMiddleName.value = null;
    paxPhoneNumber.value = null;
    paxEmail.value = null;
    templateType = null;
    paxMessage.value = null;

    console.log(html);

    for (let i = 0; i < templateTypes.length; i++) {
      templateTypes[i].checked = false;
    }

    if (button.id == "btnAddPax") {
      //add new pax to reciept
      var count = 0;
      btnSavePax.addEventListener("click", function (e) {
        console.log(e);
        for (let i = 0; i < templateTypes.length; i++) {
          if (templateTypes[i].checked) {
            templateType = templateTypes[i].value;
          }
        }
        if (paxFamilyName.value.length == 0) {
          paxFamilyName.classList.add("is-invalid");
          return;
        } else {
          paxFamilyName.classList.remove("is-invalid");
        }
        if (paxMiddleName.value.length == 0) {
          paxMiddleName.classList.add("is-invalid");
          return;
        } else {
          paxMiddleName.classList.remove("is-invalid");
        }
        if (paxEmail.value.length == 0) {
          paxEmail.classList.add("is-invalid");
          return;
        } else {
          paxEmail.classList.remove("is-invalid");
        }
        if (paxPhoneNumber.value.length == 0) {
          paxPhoneNumber.classList.add("is-invalid");
          return;
        } else {
          paxPhoneNumber.classList.remove("is-invalid");
        }

        html = renderBeneficiaryItem(
          benefiCiariesItems.length,
          paxFamilyName.value,
          paxMiddleName.value,
          paxPhoneNumber.value,
          paxEmail.value,
          templateType,
          paxMessage.value
        );
        benefiCiaries.insertAdjacentHTML("afterbegin", html);
        $("#paxModal").modal("hide");
      });
    } else {
      console.log("edit");
    }
  });
}
function renderBeneficiaryItem(
  index,
  familyName,
  middleName,
  phone,
  email,
  type,
  message
) {
  var html = "";
  html +=
    '<div class="beneficiary__item beneficiary"><div class="beneficiary__inner">';
  html +=
    '<div class="beneficiary__body"><div class="beneficiary__icon"><i class="bi bi-person-fill"></i></div>';
  html += '<div class="beneficiary__information">';
  html +=
    '<p class="beneficiary__name">' + familyName + ", " + middleName + "</p>";
  html += '<p class="beneficiary__phone">' + phone + "</p>";
  html += '<p class="beneficiary__email">' + email + "</p>";
  html += '</div></div><div class="beneficiary__footer">';
  html +=
    '<button class="btn btn-light btn-sm btn-edit" type="button"><i class="bi bi-pencil"></i>Chỉnh sửa</button>';
  html +=
    '<button class="btn btn-light btn-sm btn-delete" type="button"><i class="bi bi-trash"></i>Xóa</button>';
  html +=
    '<input type="hidden" name="pax[' +
    index +
    '][familyName]" value="' +
    familyName +
    '"/>';
  html +=
    '<input type="hidden" name="pax[' +
    index +
    '][middleName]" value="' +
    middleName +
    '" />';
  html +=
    '<input type="hidden" name="pax[' +
    index +
    '][phoneNumber]" value="' +
    phone +
    '" />';
  html +=
    '<input type="hidden" name="pax[' +
    index +
    '][email]" value=">' +
    email +
    '" />';
  html +=
    '<input type="hidden" name="pax[' +
    index +
    '][giftType]" value="' +
    type +
    '" />';
  html +=
    '<input type="hidden" name="pax[' +
    index +
    '][message]" value="' +
    message +
    '" />';
  html += "</div></div></div>";

  return html;
}

// function closeModal(modal) {
//     // Get the backdrop so we can remove it from the body
//     const backdrop = document.querySelector('.modal-backdrop.fade.show');
//     // Remove the `modal-open` class from the body
//     document.body.classList.remove('modal-open');
//     document.body.style.removeProperty('padding-right')
//     document.body.style.removeProperty('overflow')
//     // Re-hide the modal from screen readers
//     modal.setAttribute('aria-hidden', 'true');
//     modal.removeAttribute('aria-modal', 'true');
//     modal.removeAttribute('role', 'dialog');
//     // Remove the `show` class from the backdrop
//     backdrop.classList.remove('show');
//     // Remove the `show` class from the modal
//     setTimeout(() => {
//         modal.classList.remove('show');
//       });
//     setTimeout(() => {
//         modal.style.display = 'none';
//           backdrop.remove();
//       }, 500);
//   }
