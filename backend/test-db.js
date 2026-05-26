const mongoose = require('mongoose');

const uri1 = 'mongodb+srv://mokshamehta71076_dber_us:oGlD1Zq9hTMReTID@cluster0.04jers5.mongodb.net/deskflow?retryWrites=true&w=majority';
const uri2 = 'mongodb+srv://mokshamehta71076_dber_us:oGlD1Zq9hTMReTID@interview-ai-cluster.ed865k6.mongodb.net/deskflow?retryWrites=true&w=majority';

async function test() {
  try {
    console.log('Testing uri1...');
    await mongoose.connect(uri1, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS with uri1!');
    process.exit(0);
  } catch (e) {
    console.log('Failed uri1');
  }

  try {
    console.log('Testing uri2...');
    await mongoose.connect(uri2, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS with uri2!');
    process.exit(0);
  } catch (e) {
    console.log('Failed uri2');
    process.exit(1);
  }
}

test();
