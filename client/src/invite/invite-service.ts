import $api from "../axios-setup"
import { UserResponse } from "../user/user-types";

export default new class InviteService {
    async createInvite(guests: UserResponse[], projectId: string, salary: number) {
        guests.map(async (guest: UserResponse) => {
            await $api.post("invite", {guest: guest._id, projectId, salary});
        })
    }

    async getInvited(projectId: string) {
        return (await $api.get(`/invited/${projectId}`)).data;
    }

    async getInvitesToUser() {
        return (await $api.get(`/invites-to-user`)).data;
    }

    async seeInvite(inviteId: string, accept: boolean) {
        return (await $api.post(`/see-invite/${inviteId}`, {accept})).data;
    }

    async deleteInvite(guestId: string, projectId: string) {
        return (await $api.post(`/cancel-invite`, {guestId, projectId})).data;
    }
}