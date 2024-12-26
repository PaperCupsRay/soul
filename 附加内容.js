async function getConfig(url) {
	const Base64 = {
		encode(str) {
		    // 首先，我们使用 encodeURIComponent 来获得百分比编码的UTF-8，然后我们将百分比编码转换为原始字节，最后存储到btoa里面
		    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
			function toSolidBytes(match, p1) {
			    return String.fromCharCode(Number('0x' + p1));
			}));
		},
		decode(str) {
		    // 过程：从字节流到百分比编码，再到原始字符串
		    return decodeURIComponent(atob(str).split('').map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		    }).join(''));
		}
	}

	let newapi = null;
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Cache-Control': 'no-cache'//不缓存
			}
		});
		let jsondata = await response.json();
		//gitee内容
		if (url.startsWith("https://gitee.com/api/v5/repos/")) {
    
			newapi = JSON.parse(Base64.decode(jsondata.content));
		} else {
			newapi = jsondata;
		}
	} catch (error) {
		newapi = error;
	}
	return newapi;
}

if (env.CONFIG) {
    let config = await getConfig(env.CONFIG);
    if (config != null && typeof (config) == "object") {
        for (let k in config) {
            env[k] = config[k];
        }
    }
}
