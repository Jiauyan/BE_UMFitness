const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where } = require("firebase/firestore");

const getAllMotivationalQuotes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db,'MotivationalQuotes'));
      const motivationalQuotes = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
      return motivationalQuotes;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
  }

  const getAllUserMotivationalQuotes = async (uid) => {
    try {
      const motivationalQuotesRef = collection(db, 'MotivationalQuotes');
      const q = query(motivationalQuotesRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      const motivationalQuotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return motivationalQuotes;
    } catch (error) {
      console.error('Error fetching motivationalQuotes:', error);
      throw error;
    }
  };

const getMotivationalQuoteById = async (id) => {
    try {
      const motivationalQuoteSnap = await getDoc(doc(db,'MotivationalQuotes',id));
      const motivationalQuote = {id: motivationalQuoteSnap.id, ...motivationalQuoteSnap.data()};
      return motivationalQuote;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
}


const addMotivationalQuote = async (uid, motivationalQuote) => {
  try {
    const addMotivationalQuote = await addDoc(collection(db, 'MotivationalQuotes'), {
      uid,
      motivationalQuote,
    });
    
    return { id: addMotivationalQuote.id, motivationalQuote, uid };
  } catch (error) {
    console.error('Error adding motivationalQuote:', error);
    throw error;
  }
};


const updateMotivationalQuote = async (id, uid, motivationalQuote) => {
  try {
    const updateMotivationalQuote = await setDoc(doc(db,'MotivationalQuotes',id),{
      uid,
      motivationalQuote
    })
    return { id, motivationalQuote, uid };
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}


const deleteMotivationalQuote = async (id) => {
  try {
    const deleteMotivationalQuote = await deleteDoc(doc(db,'MotivationalQuotes',id));
    return id;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
}

const getRandomMotivationalQuote = async (id) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'MotivationalQuotes'));
      const motivationalQuotes = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(quote => quote.id !== id);
  
      if (motivationalQuotes.length === 0) {
        throw new Error('No motivational quotes found');
      }
  
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      return motivationalQuotes[randomIndex];
    } catch (error) {
      console.error('Error fetching random motivational quote:', error);
      throw error;
    }
  };

module.exports = {
    getAllMotivationalQuotes,
    getAllUserMotivationalQuotes,
    getMotivationalQuoteById,
    addMotivationalQuote,
    updateMotivationalQuote,
    deleteMotivationalQuote,
    getRandomMotivationalQuote
  };
  