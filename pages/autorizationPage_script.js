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

function sendToRegister() {
  event.preventDefault();
  window.location.href = "registerPage.html";
};

function sendToProfile() {
  window.location.href = "profilePage.html";
};

function sendPost() {
  axios.post("auth/login", {"username": emailForm.email, "password": passwordForm.password})
    .then(response => {
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      sendToProfile();
    });
    //.then(response => axios.get("profile", { headers: {"Authorization" : `Bearer ${response.data.access_token}`} })
};

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
			sendPost();
		}
		event.preventDefault();
	}
};

let emailForm = new Vue({
	el: '#form__email',
	data: {
		email: '',
		correctFlag: false
	},
	methods: {
		handler: function() {
			let regExp = /^[-.\w]+@([\w-]+\.)+[\w-]+$/;
			if (!regExp.test(this.email)) {
				let message = document.createElement('p');
				message.innerText = 'Необходимо верно заполнить поле';
				message.style.position = 'absolute';
				message.style.top = '75px';
				message.style.minWidth = '500px';
				message.style.color = 'red';
				message.classList.add('warning');
				
				if(!this.$el.querySelector('.warning')) {
					this.$el.append(message);
					this.$el.querySelector('input').style.borderColor = 'red';
				}
				this.correctFlag = false;
				return true;
			} else {
				if (this.$el.querySelector('.warning')) {
					this.$el.querySelector('.warning').remove();
					this.$el.querySelector('input').style.borderColor = 'black';
				}
				this.correctFlag = true;
				return true;
			}
		}
	}
});

formObject.inputList.push(emailForm);

let passwordForm = new Vue({
	el: '#form__password',
	data: {
		password: '',
		correctFlag: false
	},
	methods: {
		handler: function() {
			let regExp = /^\S+$/;
			if (!regExp.test(this.password)) {
				let message = document.createElement('p');
				message.innerText = 'Необходимо верно заполнить поле';
				message.style.position = 'absolute';
				message.style.top = '75px';
				message.style.minWidth = '500px';
				message.style.color = 'red';
				message.classList.add('warning');
				
				if(!this.$el.querySelector('.warning')) {
					this.$el.append(message);
					this.$el.querySelector('input').style.borderColor = 'red';
				}
				this.correctFlag = false;
				return true;
			} else {
				if (this.$el.querySelector('.warning')) {
					this.$el.querySelector('.warning').remove();
					this.$el.querySelector('input').style.borderColor = 'black';
				}
				this.correctFlag = true;
				return true;
			}
		}
	}
});

formObject.inputList.push(passwordForm);

document.querySelector('.form').addEventListener('submit', formObject.submitHandler.bind(formObject));

document.querySelector('#form__button_register').addEventListener('click', sendToRegister);

window.addEventListener('click', hideNotification);