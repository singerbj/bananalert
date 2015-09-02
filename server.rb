require 'sinatra'
require 'json'
require 'active_record'
require 'sqlite3'
require 'rufus-scheduler'
require 'sms-easy'
require 'mail'
 
class Banana < ActiveRecord::Base
end

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: 'dbfile.sqlite3')

if ARGV[0] == 'reset'
  if ActiveRecord::Base.connection.table_exists? 'bananas'
    ActiveRecord::Migration.class_eval do
      drop_table :bananas do |t|
      end
    end
  end
  ActiveRecord::Migration.class_eval do
    create_table :bananas do |t|
      t.string :phone
      t.string :carrier
      t.datetime :notifyDate      
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
    if o['notifyDate']
      b.notifyDate = o['notifyDate'].to_datetime
    else
      msg = "notifyDate not specified"
      throw msg
    end   
    if o['phone']
      b.phone = o['phone'].to_s
    else
      msg = "phone not specified"
      throw msg
    end 
    if o['carrier']
      b.carrier = o['carrier'].to_s
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


def check_for_alerts  
  puts "== checking times in db #{Time.now}"
  SMSEasy::Client.config['from_address'] = "bananalertnotify@gmail.com"
  sms = SMSEasy::Client.new
  bananas = Banana.all
  bananas.each do |b|
    puts "#{b.inspect} == #{Time.now}"
    if b.notifyDate.past?
      puts "sending text to #{b.phone} on carrier #{b.carrier}"

      Mail.deliver do
        from 'bananalertnotify@gmail.com'
        to SMSEasy::Client.sms_address(b.phone, b.carrier)
        body "BANANALERT! Your banana is ready to be eaten based on your personal preferences!"
      end

      b.destroy!
    end
  end
  ActiveRecord::Base.connection.close
end

check_for_alerts 
scheduler = Rufus::Scheduler.new
scheduler.every '3' do    
  check_for_alerts  
end

