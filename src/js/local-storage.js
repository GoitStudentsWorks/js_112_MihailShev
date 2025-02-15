import iziToast from 'izitoast';
import { iziToastCommonOptions } from './iziToastCommonOptions';

// Класс-библиотека LocalStorageForm для сохранения значений элементов формы в Local Storage, а также считывания из хранилища и заполнения формы.
// Для использования необходимо: 
//  - импортировать класс import LocalStorageForm from '.ваш-путь/local-storage'
//  - создать объект типа LocalStorageForm, предоставив два параметра: имя ключа для доступа к полям формы, и ссылку на элемент формы:
//    let localStorageForm = new LocalStorageForm('имя-ключа', ссылка-на-элемент-формы);
//  - доступные методы:
//    fillFormFromLS(ссылка-на-форму) - заполняет форму данными из хранилища, передать ссылку на форму;
//    saveDataFormToLS(event) - сохраняет данные в хранилище;
//    clearDataFormLS(event, cсылка-на форму) - очищает хранилище и форму;

class LocalStorageForm {
  
  constructor(keyFormDataLS, formElement) {
    this.keyFormDataLS = keyFormDataLS;
    this.formData = {};
    const length = formElement.elements.length;
    for (let i = 0; i < length; i++) {
      if (formElement.elements[i].name !== '') {
        this.formData[formElement.elements[i].name] = undefined;
      }
    };
  }
  
  _isFieldNonEmpty = el => el.trim().length > 0;

  _isFielsdNonEmpty = obj => Object.values(obj).every(this._isFieldNonEmpty);
  
  fillFormFromLS = (formEl) => {
    
    try {
      if (localStorage.length === 0) {
        return;
      }
      const dataFormFromLS = JSON.parse(localStorage.getItem(this.keyFormDataLS));
    
      for (let key in dataFormFromLS) {
        const value = dataFormFromLS[key];

        if (this._isFieldNonEmpty(value)) {
          formEl.elements[key].value = value;
          this.formData[key] = value;
        }
      }
    } catch (err) {
      iziToast.show({
        ...iziToastCommonOptions,
        message: `Sorry, you have error ${err}. Please try again!`,
      });
    }
  };
  
  saveDataFormToLS = (event) => {
    const formField = event.target; 
    this.formData[formField.name] = formField.value;
    localStorage.setItem(this.keyFormDataLS, JSON.stringify(this.formData));
  };
  
  clearDataFormLS = (event, formEl) => {
    event.preventDefault();
    if (this._isFielsdNonEmpty(this.formData)) {
      formEl.reset();
      Object.keys(this.formData).forEach(key => delete this.formData[key]);
      localStorage.removeItem(this.keyFormDataLS);
    } else {
      iziToast.show({
        ...iziToastCommonOptions,
        message: 'Fill please all fields',
      });
    }
  };
}
export default LocalStorageForm;
