/*
* @version 1.0.0
* @author Petrov Alexander
* @company LessonWeb
*/


(function( $ ) {
  $.fn.selectorLw = function(options) {

    var settings = $.extend( {
      'multiple_input' : false,
    }, options);

    var selector=this;
    //Определяем мультивыбор в перменную
    var multiple=selector.prop('multiple');

    //Создаем родительский блок
    selector.wrap('<div class="selector-lw"></div>');

    //Помещаем родителя в переменную
    var parent_selector=selector.parent();

    console.log(parent_selector);

    if(multiple==false){
      //Если мультивыбор выключен, то задаем исходное значение селектора.
      var value=selector.val();
      var name=selector.find('option[value="'+value+'"]').html();
    }else{
      //Если мультивыбор включено, опеределяем сколько значений включено изначальено
      var value=selector.val();
      if(value.length==0){
        //Если ничего изначально не выбрано, то пишем значение placeholder
        if(selector.attr('placeholder')==undefined || selector.attr('placeholder').length==0){
          //Если placeholder пустой или не задан, то пишем "Выбрано (0)"
          var name='Выбрано (0)'
        }else{
          var name=selector.attr('placeholder');
        }

      }else{
        var name='Выбрано ('+value.length+')';
      }

    }
    //Создаем блоки для текста, иконки и option
    parent_selector.append('\
      <div class="selector-lw-parent">\
        <div class="selector-lw-name">'+name+'</div>\
        <div class="selector-lw-icon selector-lw-icon-close"></div>\
      </div>\
      <div class="selector-lw-option"></div>\
    ');

    //Создаем список с  option из селектора
    var ul_html='<ul>';
    parent_selector.find('option').each(function(){
      if($(this).prop('selected')){
        var active='selector-lw-active';
        var checked='checked';
      }else{
        var active='';
        var checked='';
      }
      //Если множественный выбор, инпуты включены, то внедряем дополнительно инпуты
      if(settings['multiple_input']==true && multiple==true){
        var id=Math.floor(Math.random() * (9999 - 0 + 1)) + 0;
        ul_html+='<li class="'+active+'" value="'+$(this).attr('value')+'">\
          <input type="checkbox" id="selector-lw-input-'+id+'" '+checked+'>\
          <label for="selector-lw-input-'+id+'">'+$(this).html()+'</label></li>';
      }else{
        ul_html+='<li class="'+active+'" value="'+$(this).attr('value')+'">'+$(this).html()+'</li>';
      }

    });
    ul_html+='</ul>';

    //Вставляем список в option
    parent_selector.find('.selector-lw-option').html(ul_html);

    //Обрабатываем клик по селектору, чтобы отркыть его или закрыть
    parent_selector.find('.selector-lw-parent').click(function(){
      var parent_option=$(this).parent().find('.selector-lw-option');
      if(parent_option.css('display')=='none'){
        parent_option.slideDown();
        parent_selector.find('.selector-lw-icon').removeClass('selector-lw-icon-close').addClass('selector-lw-icon-open');
      }else{
        parent_option.slideUp();
        parent_selector.find('.selector-lw-icon').removeClass('selector-lw-icon-open').addClass('selector-lw-icon-close');
      }

    });

    //При клике вне option, закрываем его.
    $(document).mouseup(function (e){ // событие клика по веб-документу
    	var div = $(".selector-lw-option"); // тут указываем ID элемента
    	if (!div.is(e.target) // если клик был не по нашему блоку
    	    && div.has(e.target).length === 0 // и не по его дочерним элементам
          && $('.detail_task_fixed').has(e.target).length === 0  // и не по блоку детальной задачи
        ) {
    		div.slideUp();
        div.parent().find('.selector-lw-icon').removeClass('selector-lw-icon-open').addClass('selector-lw-icon-close');
    	}
    });


    if(multiple==false){
      //Если множественный выбор выключен, обрабатываем клик по элементу списка
      parent_selector.find('li').click(function(){
        //Заносим option в переменную
        var parent_option=parent_selector.find('.selector-lw-option');
        //Скрываем option
        parent_option.slideUp();
        //Изменяем классы иконки
        parent_selector.find('.selector-lw-icon').removeClass('selector-lw-icon-open').addClass('selector-lw-icon-close');

        //Делаем нужный элемент списка активным.
        parent_option.find('li').removeClass('selector-lw-active');
        $(this).addClass('selector-lw-active');

        //Задаему селектору значение которое выбрали.
        var name=$(this).text();
        parent_selector.find('.selector-lw-name').text(name);

        //Задачем атрибут selected для нужного option
        var value=$(this).attr('value');
        parent_selector.find('option').removeAttr('selected');
        parent_selector.find('option[value="'+value+'"]').attr('selected','selected');

      });
    }else{
      //Если множественный выбор включен, обрабатываем клик по элементу списка
      if(settings['multiple_input']==true){
        parent_selector.find('input').click(function(){
          var parent_option=$(this).parent('.selector-lw').find('.selector-lw-option');
          if($(this).parent().is('.selector-lw-active')){
            $(this).parent().removeClass('selector-lw-active');
            var value=$(this).parent().attr('value');

            parent_selector.find('option[value="'+value+'"]').removeAttr('selected','selected');

          }else{
            $(this).parent().addClass('selector-lw-active');
            var value=$(this).parent().attr('value');
            parent_selector.find('option[value="'+value+'"]').attr('selected','selected');

          }

          var values=parent_selector.find('select').val();
          var name='Выбрано ('+values.length+')';
          parent_selector.find('.selector-lw-name').text(name);

        });
      }else{

        parent_selector.find('li').click(function(){
          var parent_option=$(this).parent('.selector-lw').find('.selector-lw-option');
          if($(this).is('.selector-lw-active')){
            $(this).removeClass('selector-lw-active');
            var value=$(this).attr('value');

            parent_selector.find('option[value="'+value+'"]').removeAttr('selected','selected');

          }else{
            $(this).addClass('selector-lw-active');
            var value=$(this).attr('value');
            parent_selector.find('option[value="'+value+'"]').attr('selected','selected');

          }

          var values=parent_selector.find('select').val();
          var name='Выбрано ('+values.length+')';
          parent_selector.find('.selector-lw-name').text(name);

        });

      }


    }

  };
})(jQuery);
