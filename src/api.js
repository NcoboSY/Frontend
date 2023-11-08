import axios from "axios";

const { CancelToken } = axios;
const search = (input) => {
  if (input) {
    try {
      const source = CancelToken.source();
      const request = axios.get(`/api/search?keyword=${input}`, {

      });
      return {
        async process(callback) {
          request.then((response) => {
            const json = response.data;
            console.log(json);

            if (json && json.data) {
              callback(
                json.data.map(({ address }) => {
                  return {
                    city: address.cityName,
                    code: address.cityCode,
                    country: address.countryName,
                    state: address.stateCode,
                  };
                })
              );
            }
          });
        },
        cancel() {
          source.cancel();
        },
      };
    } catch (error) {
      console.error(error);
    }
  }
  return {
    process() {
      return [];
    },
    cancel() {},
  };
};
const json = '';
const hotelIds = [];
const offers = [];
const getHotels = async (cityCode) => {
  try {
    const response = await axios.get(
      `/api/hotels?cityCode=${cityCode}`
    );
    const json = response.data;
    console.log(json);
    if (json && json.data) {

      for (let i = 0; i < 10; i++){
        hotelIds.push(json.data[i].hotelId);
      }  
      console.log(hotelIds);

      const hotelResponse = await axios.get(`/api/hoteloffers?hotelIds=${hotelIds}`);
      const hotelJson = hotelResponse.data;

      console.log(hotelJson);

      return hotelJson.data.map(({ hotel }) => hotel);   

    }
  } catch (error) {
    console.error(error);
  }
  return [];
};


const getHotelOffers = async (hotelIds) => {
  try {
    const response = await axios.get(`/api/hoteloffers?hotelIds=${hotelIds}`);
    const json = response.data;
    console.log(json);
    if (json && json.data) {
      return json.data[0].offers;
    }
  } catch (error) {
    console.error(error);
  }
  return [];
};

const getOffers = async (hotelId, checkInDate, checkOutDate) => {
  try {
    //console.log(checkInDate + '' + checkOutDate);
    const response = await axios.get(`/api/offers?hotelIds=${hotelId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
    const json = response.data;
   

    if (json && json.data) {
      console.log(json.offers);

      for (let i = 0; i < 10; i++){
        offers.push(json[i].offers);
      }  
      console.log(offers);

      //const offersJson = offers.data;

      return offers;
    }
  } catch (error) {
    console.error(error);
  }
  return [];
};


const confirmOffer = async (offerId) => {
  try {
    const response = await axios.get(`/api/offer?offerId=${offerId}`);
    const json = response.data;

    if (json && json.data) {
      return json.data;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};
const makeBooking = async (offerId) => {
  const testData = {
    guests: [
      {
        name: {
          title: "MR",
          firstName: "BOB",
          lastName: "SMITH",
        },
        contact: {
          phone: "+33679278416",
          email: "bob.smith@email.com",
        },
      },
    ],
    payments: [
      {
        method: "creditCard",
        card: {
          vendorCode: "VI",
          cardNumber: "4111111111111111",
          expiryDate: "2023-01",
        },
      },
    ],
  };

  try {
    const response = await axios.post(
      `/api/booking?offerId=${offerId}`,
      testData
    );
    const json = response.data;

    if (json && json.data) {
      return json.data;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

export { search, getHotels, getOffers, confirmOffer, makeBooking };
