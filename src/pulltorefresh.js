
(function(window){
	const _defaults = {
		instructionsPullToRefresh: 'pull to refresh', // text
		instructionsReleaseToRefresh: 'Release to refresh', //text
		instructionsRefreshing: 'refreshing', // text
		threshold: 60, // minimum distance required to trigger the refresh.
	  onPull: () => location.reload()
	};
	let	_pullLengh = 0;
	let	_startLength = 0;
	let _ptrEle = '';
	let _ptrTextEle = '';
	let _element = '';
	function preventDefault(ev) {
	  ev.preventDefault()
	}
	let pullToRefresh = {
		init: function(cfg){
	    Object.keys(_defaults).forEach((key) => {
	      cfg[key] = cfg[key] || _defaults[key];
	    });
			_element = document.querySelector(cfg.targetElement);
			_ptrEle = document.querySelector(cfg.ptrElement);
			_ptrTextEle = document.querySelector(cfg.ptrTextElement);
			
			// init style
			_element.style.position = 'relative';
			_ptrEle.style.position = 'absolute';
			_ptrTextEle.innerText = cfg.instructionsPullToRefresh;
			
			// blind event
			_element.addEventListener('touchstart', function(event){
				_startLength = event.touches[0].pageY;
				// _element.removeAttribute('style');
				_element.style['transition'] = 'transform 0s';
				// 'pull to refresh'
				_ptrTextEle.innerText = cfg.instructionsPullToRefresh;
			});
			_element.addEventListener('touchmove', function(event){					
					_pullLengh = event.touches[0].pageY - _startLength;
					if(_pullLengh > 10 && document.body.scrollTop === 0){ // 下拉刷新
						pullElement(_element, _pullLengh, cfg);						
					} else { // 正常下拉滚动
							document.removeEventListener('touchmove', preventDefault, false)
					}
			});
			_element.addEventListener('touchend', function(event){
				console.log(_element.scrollTop);
				console.log(document.body.scrollTop);
				if(_element.scrollTop === 0 && document.body.scrollTop === 0){
					if(_pullLengh > cfg.threshold){
						// 'refreshing'
						_ptrTextEle.innerText = cfg.instructionsRefreshing;
						cfg.onPull();
						_pullLengh = 0;
					} 
					_element.style['transition'] = 'transform 0.6s ease';
					_element.style['transform'] = 'translate(0, 0px)';
				}
			});
		}
	}

	let pullElement = function(element, length, cfg){
		if(length < _ptrEle.offsetHeight){
			element.style['transform'] = 'translate(0, ' + length + 'px)';
			if(length > cfg.threshold){
				// 'release to fresh'
				_ptrTextEle.innerText = cfg.instructionsReleaseToRefresh;
			}
		}
	};
	window.pullToRefresh = pullToRefresh;
})(window);
