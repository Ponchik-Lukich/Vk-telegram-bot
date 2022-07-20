import easyvk from "easyvk";

async function doesExists(checkDomain) {
    const vk = await easyvk({
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        token: process.env.VK_TOKEN
    })
    try {
        let vkr = await vk.call('groups.getById', {
            group_id: checkDomain
        });
        return !(vkr[0].is_closed !== 0 || vkr[0].name === 'DELETED');
    } catch (e) {
        return false
    }

}

async function connect(checkDomain) {
    const vk = await easyvk({
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        token: process.env.VK_TOKEN
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