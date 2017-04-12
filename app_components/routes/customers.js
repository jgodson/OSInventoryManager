const DB = require(`../../${config.paths.data_folder}/db_actions`);

const ROUTES = {
  list() {
    return DB.customers.findAll()
      .then((customers)=> {
        return Promise.resolve({ customer_list: customers });
      })
      .catch((error)=> {
        return Promise.resolve({ error: error });
      });
  },
  create: "customers_create",
  details(id) {
    return DB.customers.findById(id)
      .then((error, customer)=> {
        if (error) {
          return Promise.resolve({ error: error });
        }
        return Promise.resolve({ customer: customer });
      });
  }
}

module.exports = ROUTES;