class FlightItem extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static observedAttributes() {
    return ["flightData"];
  }
  attributeChangedCallback(prop, oldValue, newValue) {
    console.log(prop);
    if (prop === flightData) this.render();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.shadow.innerHTML = `<div class="flight-option-item one-stop">
      <div class="flight-option-bar">
        <div class="flight-option-top">
          <div class="flight-option-location-time">
            <span class="flight-option-time">10:00</span>
            <span class="flight-option-city">Hà Nội</span>
            <span class="flight-option-date">15 Thg 08</span>
          </div>
          <div class="flight-option-types">
            <div class="flight-option-middle-inner">
              <div class="flight-option-icon icon-flight">
                <span class="flight-code">VJ142 | A330</span>
                <span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z" />
                  </svg>
                </span>
              </div>
              <div class="flight-option-stop">
                <span class="name-stop">DAD</span>
                <span class="icon-stop">
                  <span class="ic-circle"></span>
                </span>
                <span class="text-label">1 điểm dừng</span>
              </div>
              <div class="flight-option-icon icon-flight">
                <span class="flight-code">VJ148 | A331</span>
                <span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div class="flight-option-location-time">
            <span class="flight-option-time">12:00</span>
            <span class="flight-option-city">Tp Hồ Chí Minh</span>
            <span class="flight-option-date">15 Thg 08</span>
          </div>
        </div>
        <div class="flight-option-infor">
          <ul>
            <li>
              <p class="duration-label">Thời gian bay</p>
              <p class="duration-time">2 giờ 15 phút</p>
            </li>
            <li>
              <button class="btn btn-flight-option-detail">
                Chi tiết <i class="bi bi-chevron-down"></i>
              </button>
            </li>
          </ul>
        </div>
        <div class="flight-option-price">
          <div class="flight-option-price--inner">
            <!-- <p class="price">
              <del
                >1,200,000<span class="currency-symbol"
                  >VND</span
                ></del
              >
            </p> -->
            <p class="price">
              <ins>850,000<span class="currency-symbol">VND</span></ins>
            </p>
          </div>
          <div class="flight-option-btns">
            <button class="btn btn-booking-selecting">
              Chọn
            </button>
          </div>
        </div>
      </div>
      <div class="flight-option-dropdown">
        <div class="dropdown-inner">
          <div class="flight-option-detail">
            <div class="flight-option-detail-inner">
              <div class="flight-option-depart">
                <div class="option-detail-flight-code">
                  <div class="option-detail-icon">
                    <span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z">
                        </path>
                      </svg>
                    </span>
                  </div>
                  <div class="option-detail-content">
                    <div class="option-label">
                      <p>Số hiệu chuyến bay:</p>
                    </div>
                    <div class="option-value">
                      <p class="flight-code">VJ142</p>
                    </div>
                  </div>
                </div>
                <div class="option-detail-flight-city-airport">
                  <div class="option-detail-content">
                    <div class="option-label">
                      <p>Khởi hành:</p>
                    </div>
                    <div class="option-value">
                      <ul>
                        <li class="city">
                          Hà Nội (HAN) - Sân bay Nội Bài
                        </li>
                        <li class="time">
                          06:50, 17/08/2022 (Giờ địa phương)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="option-detail-flight-city-airport">
                  <div class="option-detail-content">
                    <div class="option-label">
                      <p>Đến:</p>
                    </div>
                    <div class="option-value">
                      <ul>
                        <li class="city">
                          Đà Nẵng (DAD) - Sân bay Đà Nẵng
                        </li>
                        <li class="time">
                          06:50, 17/08/2022 (Giờ địa phương)
                        </li>
                        <li class="aircraft">
                          <p>Thời gian: 2 giờ 05 phút</p>
                          <p>Máy bay: A320</p>
                          <p>Hãng khai thác: Vietjet</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flight-option-onstop">
                <div class="option-detail-flight-onstop">
                  <div class="option-detail-icon">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div class="option-detail-content">
                    <p>
                      Thời gian nối chuyến ở Đà Nẵng (DAD) 1
                      giờ 05 phút
                    </p>
                  </div>
                </div>
              </div>
              <div class="flight-option-depart depart-last">
                <div class="option-detail-flight-code">
                  <div class="option-detail-icon">
                    <span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z">
                        </path>
                      </svg>
                    </span>
                  </div>
                  <div class="option-detail-content">
                    <div class="option-label">
                      Số hiệu chuyến bay:
                    </div>
                    <div class="option-value">
                      <p class="flight-code">VJ142</p>
                    </div>
                  </div>
                </div>
                <div class="option-detail-flight-city-airport">
                  <div class="option-detail-content">
                    <p class="option-label">Khởi hành:</p>
                    <div class="option-value">
                      <ul>
                        <li class="city">
                          Đà Nẵng (DAD) - Sân bay Đà Nẵng
                        </li>
                        <li class="time">
                          06:50, 17/08/2022 (Giờ địa phương)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="option-detail-flight-city-airport">
                  <div class="option-detail-icon bottom">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div class="option-detail-content">
                    <div class="option-label">
                      <p>Đến:</p>
                    </div>
                    <div class="option-value">
                      <ul>
                        <li class="city">
                          Tp. Hồ Chí Minh (SGN) - Sân bay Quốc
                          tế Tân sơn nhất
                        </li>
                        <li class="time">
                          06:50, 17/08/2022 (Giờ địa phương)
                        </li>
                        <li class="aircraft">
                          <p>Thời gian: 2 giờ 05 phút</p>
                          <p>Máy bay: A320</p>
                          <p>Hãng khai thác: Vietjet</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }
}

customElements.define("flight-item", FlightItem);
