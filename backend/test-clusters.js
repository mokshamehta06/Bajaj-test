const mongoose = require('mongoose');

const credentials = 'mokshamehta71076_dber_us:oGlD1Zq9hTMReTID';
const clusters = [
  'cluster0.04jers5.mongodb.net',
  'interview-ai-cluster.ed865k6.mongodb.net',
  'yt-auth.sqrrqsx.mongodb.net',
  'backend.amcmnxe.mongodb.net'
];

async function testAll() {
  for (const cluster of clusters) {
    const uri = `mongodb+srv://${credentials}@${cluster}/deskflow?retryWrites=true&w=majority`;
    try {
      console.log(`Testing ${cluster}...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`SUCCESS! Found the correct cluster: ${cluster}`);
      process.exit(0);
    } catch (e) {
      console.log(`Failed ${cluster}`);
    }
  }
  console.log('None worked.');
  process.exit(1);
}

testAll();
