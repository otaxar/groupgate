# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end

execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
#  package "nginx"
package "tree"
package "ack-grep"
# package "postgresql"
package "nodejs"
package "npm"
package "git"
package "mongodb"


# cookbook_file "index.html" do
#  path "/var/www/html/index.html"
# end

cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end

execute 'ntp_restart' do
  command 'service ntp restart'
end
