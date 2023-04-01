import axios from "axios";

const API = "http://localhost:5000/api/auth";

export function signup (data) {
    return axios.post(`${API}/signUp`, data);
}

export function login(data){
    return axios.post(`${API}/signin`, data);
}

export function isLoggedIn(){
    let data=localStorage.getItem("token");
    if(!data){
        return false;
    }
    else {
        return true;
    }
}

export function getVehicleSlots(type, from, to, headers){
    return axios.get(`${API}/vehicle?type=${type}&from=${from}&to=${to}`, headers);
}

export function getSlotInfo(id, headers){
    return axios.get(`${API}/getSlotInfo/${id}`, headers);
}

export function slotBooking(data, headers){
    return axios.post(`${API}/postSlot`, data, headers);
}

export function getStatisticsByMonth(year, headers){
    return axios.get(`${API}/getStatsByMonth?year=${year}`, headers)
}

export function createOrder(amount){
    return axios.post(`${API}/order`, amount);
}

export function createVerify(data){
    return axios.post(`${API}/verify`, data);
}

export function getPaymentDetails(paymentId){
	return axios.post(`${API}/paymentdetails`, paymentId);
}
