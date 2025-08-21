import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  autoCloseEnabled: { type: Boolean, default: true },
  confidenceThreshold: { type: Number, default: 0.75 },
  slaHours: { type: Number, default: 24 },
});

configSchema.statics.getSingleton = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

const Config = mongoose.model('Config', configSchema);
export default Config;