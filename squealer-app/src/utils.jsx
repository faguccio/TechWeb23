import { pages } from "./router.jsx";

export const Const = {
  STATUS_OK: 200,
  STATUS_UNAUTHORIZED: 401,
  //apiurl: `/api`,
  apiurl: `http://localhost:8000/api`,
};

const loginRequest = async (username, password) => {
  const res = await fetch(`${Const.apiurl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username,
      password: password,
    }),
  });
  const ret = {
    data: await res.json(),
    status: await res.status,
  };

  return ret;
};

export function loginUser(inputData, redirectFun, setLoggedIn) {
  loginRequest(inputData.username, inputData.password).then((res) => {
    if (res.status === Const.STATUS_OK) {
      //document.querySelector(".alert").classList.replace("flex", "hidden")
      //remove old token and userID from Local Storage and add new ones
      localStorage.removeItem("token");
      localStorage.removeItem("userID");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userID", res.data.userID);
      setLoggedIn(true);
      //redirect to home page
      redirectFun(pages[0].path); //pages[0] = home page
    } else if (res.status === Const.STATUS_UNAUTHORIZED) {
      document.querySelector(".alert").classList.replace("hidden", "flex");
      document.querySelector("#error_message").innerHTML = res.data.message;
    }
  });
}

export function kmToCal(km) {
  return 51.2 * km;
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
