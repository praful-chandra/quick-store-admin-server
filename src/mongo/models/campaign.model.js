const mongoose = require("mongoose");

const zeroNumber  ={
    type: Number,
    default: 0,
  }

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  views: zeroNumber,
  itemsSold: zeroNumber,
  amountRaised:zeroNumber,
  image : {
      type : Buffer,
      required : true
  },
  items : []
},{timestamps : true});

CampaignSchema.methods.toJSON = function(){
  const campaign = this.toObject();

  campaign.image = `/api/serveImage/campaign/${campaign._id}`;
  return campaign;
}


const Campaign = mongoose.model("campaign",CampaignSchema);

module.exports = Campaign;