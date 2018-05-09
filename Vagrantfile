# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/trusty32"        # trusty32 works
  # config.vm.box_check_update = false

  config.vm.network "forwarded_port", guest: 3000, host: 3000		  # nodejs

  # config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network"

  config.ssh.username = "vagrant"
  config.vm.synced_folder "./project", "/home/vagrant/project"

  config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
     vb.memory = "2048"
   end
  

 config.vm.provision "chef_solo" do |chef|
    chef.cookbooks_path = "chef/cookbooks"
    chef.add_recipe "baseconfig"
    #chef.channel = "stable"
    #chef.version = "12.10.24"
 end


 config.vm.provision "shell", inline: <<-SHELL
   sudo apt-get update
   sudo apt-get install -y g++

   # --> START MONGODB (got installed via chef recipe)
   service mongodb start                                          

   # --> INSTALL SERVER PACKAGES
   cd /home/vagrant/project/server                            
   npm install

   # --> START NODE.JS SERVER
   cd ..
   nodejs . 
       
  SHELL
end
