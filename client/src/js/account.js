// Import local modules
import { updateMethod } from './modules/ajax.js';
import { populateFields, validateUpdate, validatePasswords, extractForm, errHandler, resetErrors, resetFields } from './modules/account-util';

const profileForm = document.querySelector('.account-profile-form');
const securityForm = document.querySelector('.account-security-form');
const successBanner = document.querySelector('.success-banner');
const logoutLink = document.querySelector('.logout-link');

if (profileForm) {
  const profileFields = profileForm.querySelectorAll('input');
  populateFields(profileFields);

  profileForm.addEventListener('submit', () => {
    let formData = new FormData(profileForm);
    let validationResult = validateUpdate(formData);
    successBanner.style.display = 'none';
    resetErrors(profileFields);

    if (validationResult.isValid) {
      let updateInfo = extractForm(validationResult.form);

      updateMethod('/account/profile/edit', JSON.stringify(updateInfo)).then(serverResponse => {
        if (serverResponse.success) {
          successBanner.style.display = 'block';
          populateFields(profileFields);
        }
      }).catch(err => errHandler(err, profileForm, profileFields));
    } else {
      errHandler(validationResult, profileForm, profileFields);
    }
  }, false);
}

if (securityForm) {
  const securityFields = securityForm.querySelectorAll('input');

  securityForm.addEventListener('submit', () => {
    let formData = new FormData(securityForm);
    let validationResult = validatePasswords(formData);
    successBanner.style.display = 'none';
    resetErrors(securityFields);

    if (validationResult.isValid) {
      let passwordUpdate = extractForm(validationResult.form);

      updateMethod('/account/security/password', JSON.stringify(passwordUpdate)).then(serverResponse => {
        if (serverResponse.success) {
          successBanner.style.display = 'block';
          resetFields(securityFields);
        }
      }).catch(err => {
        errHandler(err, securityForm, securityFields);
        resetFields(securityFields);
      });
    } else {
      errHandler(validationResult, securityForm, securityFields);
    }
  }, false);
}

// Event listeners
logoutLink.addEventListener('click', () => localStorage.removeItem('loginStatus'), false); // Change login status
