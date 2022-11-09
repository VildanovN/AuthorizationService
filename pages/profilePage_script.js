const axiosApiInstance = axios.create();

axiosApiInstance.interceptors.response.use(response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshTokens();
      originalRequest.headers = {"Authorization" : `Bearer ${localStorage.getItem('accessToken')}`};
      if (originalRequest.data)
        originalRequest.data = JSON.parse(originalRequest.data);
      return axiosApiInstance(originalRequest);
    }
  }
);

axiosApiInstance.interceptors.request.use(
  async config => config,
  async error => {
    console.log(originalRequest);
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshTokens(); 
      originalRequest.headers = {"Authorization" : `Bearer ${localStorage.getItem('accessToken')}`};
      return axiosApiInstance(originalRequest);
    }
  }
);

function showCover() {
  const coverDiv = document.createElement('div');
  coverDiv.classList.add('cover-div');

  document.body.style.overflowY = 'hidden';
  document.body.append(coverDiv);
};

function hideCover() {
  document.querySelector('.cover-div').remove();
  document.body.style.overflowY = '';
};

function logout() {
  event.preventDefault();
  localStorage.setItem('accessToken', '');
  localStorage.setItem('refreshToken', '');
  window.location.href = "index.html";
};

function refreshTokens() {
  return axios.get('http://localhost:3000/refresh', { headers: {"Authorization" : `Bearer ${localStorage.getItem('refreshToken')}`} })
    .then(response => {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
    });
};

function receiveData() {
  return axiosApiInstance.get("http://localhost:3000/profile", { headers: {"Authorization" : `Bearer ${localStorage.getItem('accessToken')}`} })
    .then(response => {
      nameForm.name = response.data.name;
      phoneForm.phone = response.data.phone;
      addressForm.address = response.data.address;
      aboutMeForm.aboutMe = response.data.aboutMe;
  });
}

function sendChanges() {
  axiosApiInstance.post('http://localhost:3000/profile', 
    { "name": nameForm.name,
      "phone": phoneForm.phone,
      "address": addressForm.address,
      "aboutMe": aboutMeForm.aboutMe }, 
    { headers: {"Authorization" : `Bearer ${localStorage.getItem('accessToken')}`} 
  });
}

let showNotification = function() {
	showCover();
	document.querySelector('.notification-window').style.display = 'flex';
};

let hideNotification = function() {
	if (document.querySelector('.notification-window').style.display === 'flex') {
		hideCover();
		document.querySelector('.notification-window').style.display = 'none';
	}
};

let formObject = {
	inputList: [],
	submitHandler: function(event) {
		if (this.inputList.find(item => !item.correctFlag)) {
			let unit = this.inputList.find(item => !item.correctFlag);
			if (unit.$el.querySelector('input')) {
				unit.$el.querySelector('input').focus();
				unit.$el.querySelector('input').blur();
			} else if (unit.$elquerySelector('select')) {
				unit.$el.querySelector('select').focus();
				unit.$el.querySelector('select').blur();
			}
		} else {
			showNotification();
		}
		event.preventDefault();
                sendChanges();
	}
};

let nameForm = new Vue({
	el: '#form__name',
	data: {
		name: '',
		correctFlag: false
	}
});

formObject.inputList.push(nameForm);

let phoneForm = new Vue({
	el: '#form__phone',
	data: {
		phone: '',
		correctFlag: false
	}
});

formObject.inputList.push(phoneForm);

let addressForm = new Vue({
	el: '#form__address',
	data: {
		address: '',
		correctFlag: true
	}
});

formObject.inputList.push(addressForm);

let aboutMeForm = new Vue({
	el: '#form__aboutMe',
	data: {
			aboutMe: '',
			correctFlag: true
	}
});

formObject.inputList.push(aboutMeForm);

document.querySelector('.form').addEventListener('submit', formObject.submitHandler.bind(formObject));

document.querySelector('#form__button_auth').addEventListener('click', logout);

window.addEventListener('click', hideNotification);

window.addEventListener('load', receiveData);