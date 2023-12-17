const { shapeIntoMongooseObjectId, lookup_auth_member_following } = require("../lib/config");
const FollowModel = require("../schema/follow.model");
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { lookup } = require("dns");

class Follow {
  constructor() {
    this.followModel = FollowModel;
    this.memberModel = MemberModel;
  }

  async subscribeData(member, data) {
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1); //*bu qisim esa mb ni ozini ozi follow qilolmasligiga ogoxlantiradi agara boshqalarni follow qilmoqchhi bolsa otkazadi

      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const member_data = await this.memberModel
        .findById({ _id: follow_id })
        .exec();
      assert.ok(member_data, Definer.general_err2);

      const result = await this.createSubscribtionData(
        follow_id,
        subscriber_id
      );
      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", 1); //1 bu agar oldindagi talablar bajarilsa $incriment db da follow_cnt ni bittaga oshirip qoyadi. aksincha -1 bolsa 1 ta ayrip qoyadi
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", 1); //1 bu agar oldindagi talablar bajarilsa $incriment db da subscriber_cnt ni bittaga oshirip qoyadi. aksincha -1 bolsa 1 ta ayrip qoyadi

      return true;
    } catch (err) {
      throw err;
    }
  }

  async createSubscribtionData(follow_id, subscriber_id) {
    try {
      const new_follow = new this.followModel({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });
      console.log("newFollow:::", new_follow);

      return await new_follow.save();
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.follow_err2); //this error called customized error
    }
  }

  async modifyMemberFollowCounts(mb_id, type, modifier) {
    try {
      if (type === "follow_change") {
        await this.memberModel.findOneAndUpdate(
          { _id: mb_id },
          { $inc: { mb_follow_cnt: modifier } }
        );
      } else if (type === "subscriber_change") {
        await this.memberModel.findOneAndUpdate(
          { _id: mb_id },
          { $inc: { mb_subscriber_cnt: modifier } }
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async unsubscribeData(member, data) {
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);
      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const result = await this.followModel.findOneAndDelete({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });
      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", -1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", -1);

      return true;
    } catch (err) {
      throw err;
    }
  }

  async getMemberfollowingsData(inquiry) {
    try {
      const subscriber_id = shapeIntoMongooseObjectId(inquiry.mb_id),
        page = inquiry.page * 1,
        limit = inquiry.limit * 1;

      const result = await this.followModel //followSchimaModel ichida aggregate roting amalga oshyapti
        .aggregate([
          { $match: { subscriber_id: subscriber_id } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit }, //oxrida follow document array qaytyapti
          {
            $lookup: {
              from: "members", //2) members collectionni ichidagi
              localField: "follow_id", //1)follow document arrayidagi follow_id ni members collectionni ichidagi
              foreignField: "_id", //3) _id ga tenglarini topib follow_member_data nomi ostida olib ber deyilyapti
              as: "follow_member_data", //4) follow_member_data nomi ostida olib ber deyilyapti
            },
          },
          { $unwind: "$follow_member_data" }, //*follow id faqat bitta mb_id ga tegishliligi sabab quydagi shart bilan arraydan uni object ga aylantiramiz. bu yerda qiymat Ex: meni yoki boshqalani followerlari datasiga teng boladi
        ])
        .exec();

      assert.ok(result, Definer.follow_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getMemberFollowersData(member, inquiry) {
    try {
      const follow_id = shapeIntoMongooseObjectId(inquiry.mb_id),
        page = inquiry.page * 1,
        limit = inquiry.limit * 1;

      let aggregateQuery = [
        { $match: { follow_id: follow_id } }, //follow_id: new ObjectId("6569deea1dc724bedb242a00" <= yani Men amaldagi User
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },// ayni vaqtda consoleda { $skip: 0 } ga teng chiqadi
        { $limit: limit },
        {
          $lookup: {
            from: "members",
            localField: "subscriber_id",
            foreignField: "_id",
            as: "subscriber_member_data",
          },
        },
        { $unwind: "$subscriber_member_data" },
      ];

      //following following backto subscriber
      if (member && member._id === inquiry.mb_id) {
        aggregateQuery.push(lookup_auth_member_following(follow_id));
      }
      const result = await this.followModel.aggregate(aggregateQuery).exec();
      console.log("result:::", result);
      assert.ok(result, Definer.follow_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Follow;
