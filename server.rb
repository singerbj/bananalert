require 'sinatra'
require 'json'
require 'active_record'
require 'sqlite3'
 
class Banana < ActiveRecord::Base
end



ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: 'dbfile.sqlite3')

if ARGV[0] == 'reset'
  ActiveRecord::Migration.class_eval do
    drop_table :bananas do |t|
    end
  end
  ActiveRecord::Migration.class_eval do
    create_table :bananas do |t|
      t.integer :phone
      t.string :carrier
      t.integer :hour
      t.integer :min      
    end
  end  
end
configure do
  set :public_folder, '.'
end

after { ActiveRecord::Base.connection.close }

get "/" do
  send_file File.join(settings.public_folder, 'index.html')
end

post '/bananas' do
  msg = ""
  begin
    request.body.rewind
    o = JSON.parse(request.body.read) 
    b = Banana.new   
    if o['hour']
      b.hour = o['hour'].to_i
    else
      msg = "hour not specified"
      throw msg
    end
    if o['min']
      b.min = o['min'].to_i
    else
      msg = "min not specified"
      throw msg
    end
    if o['phone']
      b.phone = o['phone'].to_i
    else
      msg = "phone not specified"
      throw msg
    end 
    if o['carrier']
      b.min = o['carrier'].to_s
    else
      msg = "carrier not specified"
      throw msg
    end 
    b.save!
    r = b.to_json
  rescue Exception => e
    r = "{\"error\": #{msg}}"
    raise e
  end
  r
end 

