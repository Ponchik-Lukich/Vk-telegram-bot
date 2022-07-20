import {VK} from 'vk-io'

async function doesExists(checkDomain) {
    try {
        const vk = await new VK({
            token: process.env.VK_TOKEN
        });
        let vkr = await vk.api.groups.getById({
            group_id: checkDomain
        });
        return (vkr[0].is_closed === 0 && vkr[0].name !== 'DELETED');
    } catch (e) {
        return false
    }

}

async function connect(checkDomain) {
    const vk = new VK({
        token: process.env.VK_TOKEN
    });
    let vkr = await vk.api.groups.getMembers({
        group_id: checkDomain
    });

    let count = vkr.count
    let offset = 1000
    let members = vkr.items

    while (offset < count) {
        try {
            let vkr = await vk.api.groups.getMembers({
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