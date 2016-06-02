# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "boxcutter/ubuntu1510"

  if Vagrant.has_plugin?("vagrant-cachier")
    config.cache.scope = :box
  end

  #config.vm.synced_folder ".", "/vagrant", type: "rsync",
  #  rsync__exclude: [".git/", ".meteor/"]

  # Disable the new default behavior introduced in Vagrant 1.7, to
  # ensure that all Vagrant machines will use the same SSH key pair.
  # See https://github.com/mitchellh/vagrant/issues/5005
  config.ssh.insert_key = false

  config.vm.network "forwarded_port", guest: 80, host: 9000

  config.vm.provider "virtualbox" do |vb|
     vb.gui = false
     vb.memory = "512"
     vb.cpus = 4
  end

  config.vm.provision "ansible" do |ansible|
    ansible.verbose = "v"
    ansible.playbook = "ansible/site.yml"
  end
end
