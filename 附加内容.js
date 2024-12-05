async function getConfig(url) {
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
			newapi = JSON.parse(atob(jsondata.content));
		} else {
			newapi = jsondata;
		}
	} catch (error) {
		newapi = error;
	}
	return newapi;
}

if (env.CONFIG) {
    config = await getConfig(env.CONFIG);
    if (config != null && typeof (config) == "object") {
        for (let k in config) {
            env[k] = config[k];
        }
    }
}