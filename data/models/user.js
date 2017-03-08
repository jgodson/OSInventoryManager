const User = {
  "title": "user schema",
  "version": 0,
  "description": "describes a user",
  "type": "object",
  "properties": {
    "id": {
      "type": "number",
      "primary": true
    },
    "firstName": {
      "type": "string"
    }, 
    "lastName": {
      "type": "string"
    }
  }
}

module.exports = User;