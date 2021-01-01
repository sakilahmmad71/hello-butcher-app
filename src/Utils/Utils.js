const Utils = {

  convertWeight:(weight) => {
    if(weight < 1000){
      return weight + "gm";
    }

    return (weight / 1000).toFixed(2) + "Kg";
  },

  convertOrderStatus:(status) => {

    switch(status){
      case "0":
        return "REQUESTED"; 
      case "1":
        return "ACCEPTED"; 
      case "2":
        return "DELIVERED";                 
      case "3":
        return "CANCELLED";                         
    }
    return "UNKNOWN"; 
  },
};

export default Utils;
