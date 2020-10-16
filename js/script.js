'use strict';

document.addEventListener('DOMContentLoaded', function() {
   const form = document.getElementById('form');
   form.addEventListener('submit', formSend);

   async function formSend(e) {
      e.preventDefault();

      let error = formValidate(form);

      let formData = new FormData(form);
      formData.append("image", formImage.files[0]);

      if (error === 0) {
         form.classList.add('_sending');
         let response = await fetch('sendmail.php', {
            method: 'POST',
            body: formData
         });
         if(response.ok) {
            let result = await response.json();
            alert(result.message);
            formPreview.innerHTML = '';
            form.reset();
            form.classList.add('_sending');
         } else {
            alert('ошибка');
            form.classList.add('_sending');
         }
         
      } else {
         alert('Заполните обязательные поля');
      }
   }

   function formValidate() {
      let error = 0;
      let formReq = document.querySelectorAll('._req');

      for (let index = 0; index < formReq.length; index++) {
         const input = formReq[index];
         formRemoveError(input);

         if(input.classList.contains('_email')) {
            if (emailTest(input)) {
               formAddError(input);
               error++;
            }
         } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
            formAddError(input);
            error++;
         } else {
            if (input.value === '') {
               formAddError(input);
               error++;
            }
         }
      }
      return error;
   }

   // добавление класса объекту
   function formAddError(input) {
      input.parentElement.classList.add ('_error');
      input.classList.add('_error');
   }

   // дудалаем класс объекту
   function formRemoveError(input) {
      input.parentElement.classList.remove('_error');
      input.classList.remove('_error');
   }

   // функция теста email
   function emailTest(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
   }  

   //получаем инпут file в переменную
   const formImage = document.getElementById('formImage');
   // получаем вид для превью в переменную
   const formPreview = document.getElementById('formPreview');

   // слушаем изменения в инпуте file
   formImage.addEventListener('change', () => {
      uploadFile(formImage.files[0]);
   });

   function uploadFile(file) {
      //преобразовать тип файла
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
         alert('Разрешены только изображения.');
         formImage.value = '';
         return;
      }

      // проверяем размер файла (< 2 мб)
      if (file.size > 2 * 1024 * 1024) {
         alert('файл должен быть менее 2 Мб');
         return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
         formPreview.innerHTML = `<img src="${e.target.result}" alt="фото">`;
         console.log('ok');
      };

      reader.onerror = function (e) {
         alert('Ошибка');
      };
      reader.readAsDataURL(file);
   }
});