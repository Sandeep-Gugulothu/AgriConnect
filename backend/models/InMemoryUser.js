const bcrypt = require('bcryptjs');

// In-memory storage
let users = [];
let userIdCounter = 1;

class InMemoryUser {
  constructor(userData) {
    this._id = userIdCounter++;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'farmer';
    this.profile = userData.profile || {};
    this.createdAt = new Date();
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new InMemoryUser({
      ...userData,
      password: hashedPassword
    });
    users.push(user);
    return user;
  }

  static async findOne(query) {
    return users.find(user => {
      if (query.email) return user.email === query.email;
      if (query._id) return user._id === query._id;
      return false;
    });
  }

  static async findById(id) {
    return users.find(user => user._id == id);
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    const user = users.find(user => user._id == id);
    if (user) {
      Object.assign(user, updateData);
    }
    return user;
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

module.exports = InMemoryUser;