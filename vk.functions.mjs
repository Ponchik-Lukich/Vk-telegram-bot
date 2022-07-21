import easyvk from "easyvk";

async function doesExists(checkDomain) {
    const vk = await easyvk({
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        save_session: false
    })
    try {
        let vkr = await vk.call('groups.getById', {
            group_id: checkDomain
        });
        return vkr.toString()
    } catch (e) {
        return e.toString()
    }

}

async function connect(checkDomain) {
    const vk = await easyvk({
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        save_session: false
    })
    let vkr = await vk.call('groups.getMembers', {
        group_id: checkDomain
    });

    let count = vkr.count
    let offset = 1000
    let members = vkr.items

    while (offset < count) {
        try {
            let vkr = await vk.call('groups.getMembers', {
                group_id: checkDomain,
                offset: offset,
                count: 1000
            });
            let newMembers = vkr.items
            members = members.concat(newMembers)
            offset += 1000
        } catch (e) {
            console.log(e)
        }
    }
    return members
}

export {doesExists, connect}