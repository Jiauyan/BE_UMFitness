class user {
  constructor(username, password, email, refId, createdDateTime) {
          this.username = username;
          this.password = password;
          this.email = email;
          this.refId = refId;
          this.createdDateTime = createdDateTime;
  }
}
module.exports = user;